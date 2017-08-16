import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

// import io from 'socket.io-client';

// DraftJS stuff 
import {
  DefaultDraftBlockRenderMap,
  Editor,
  EditorState,
  RichUtils, 
  convertToRaw, 
  convertFromRaw
} from 'draft-js';

// Stuff for left, right, and center text alignments
import { Map } from 'immutable';
const myBlockTypes = DefaultDraftBlockRenderMap.merge(new Map({
  'center': {
    element: 'center'
  }
}));

// Material-UI stuff
import RaisedButton from 'material-ui/RaisedButton';
import Popover, {PopoverAnimationVertical} from 'material-ui/Popover';
import FontIcon from 'material-ui/FontIcon';
import * as colors from 'material-ui/styles/colors';

// Colorpicker
import { SwatchesPicker } from 'react-color';



class Document extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editorState: EditorState.createEmpty(),
      inlineStyles: {}
    };


  //   this.socket = io('http://localhost:3000');
  //   this.socket.emit('hello', {name: 'Otto'});
  //   this.socket.on('helloBack', () => console.log('hello back'));
    
  //   // Put the doc idea after the doc key below 
  //   this.socket.emit('join', {doc: });
  }

  componentWillMount() {
    // const contentState = this.state.editorState.getCurrentContent(); 
    // const stringifiedContent = JSON.stringify(convertToRaw(contentState));

    // JSON.stringify != JSON.parse 
    // convertToRaw != convertFromRaw 
    console.log('made it here!');
    axios.post('http://localhost:3000/doc', {
      docId: this.props.docId,
    })
    .then((res) => {
      console.log(res);
      const destringifiedContent = convertFromRaw(JSON.parse(res.data.editorState)); 
      const newEditorState = EditorState.createWithContent(destringifiedContent);
      this.setState({editorState: newEditorState});
    })
    .catch((err) => {
      console.log(err);
    });
  }

  // componentWillUnmount() {
  //   // this.socket.disonnect();
  // };

  onChange(editorState) {
    // const contentState = editorState.getCurrentContent(); 
    this.setState({
      editorState: editorState
    });
  }

  toggleFormat(e, style, block) {
    e.preventDefault();
    if (block) {
      console.log('flag');
      console.log(style);
      this.setState({editorState: RichUtils.toggleBlockType(this.state.editorState, style)});
    } else {
      this.setState({editorState: RichUtils.toggleInlineStyle(this.state.editorState, style)});
    }
  }

  // -------------------------------------------------------------------------------------
  // Function that makes the buttons
  // -------------------------------------------------------------------------------------

  formatButton({icon, style, block}) {
    return (
      <RaisedButton
        backgroundColor={this.state.editorState.getCurrentInlineStyle().has(style) ?
          colors.teal700 : colors.teal200
        }
        icon={<FontIcon className="material-icons">{icon}</FontIcon>}
        // Why can't I have in the argument for the func?
        onMouseDown={(e) => this.toggleFormat(e, style, block)}
      />
    );
  }

  // -------------------------------------------------------------------------------------
  // Colorpicker
  // -------------------------------------------------------------------------------------

  openColorPicker(e) {
    this.setState({
      colorPickerOpen: true,
      colorPickerButton: e.target
    });
  }

  closeColorPicker(e) {
    this.setState({
      colorPickerOpen: false
    });
  }

  formatColor(color) {
    console.log('color = ', color);
    var newInlineStyles = Object.assign(
      {},
      this.state.inlineStyles,
      {
        [color.hex] : {
          color: color.hex
        }
      }
    );
    this.setState({
      inlineStyles: newInlineStyles,
      editorState: RichUtils.toggleInlineStyle(this.state.editorState, color.hex)
    });
    console.log(this.state);
  }

  colorPicker() {
    return (
      <div style={{display: 'inline-block'}}>
        <RaisedButton
          backgroundColor={colors.teal200}
          onTouchTap={this.handleTouchTap}
          label="Select a color"
          onClick={this.openColorPicker.bind(this)}
        />
        <Popover
          open={this.state.colorPickerOpen}
          anchorEl={this.state.colorPickerButton}
          anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
          targetOrigin={{horizontal: 'left', vertical: 'top'}}
          onRequestClose={this.closeColorPicker.bind(this)}
          animation={PopoverAnimationVertical}
        >
        <SwatchesPicker onChangeComplete={this.formatColor.bind(this)}/>
        </Popover>
      </div>
    );
  }

  // -------------------------------------------------------------------------------------
  // Handling document saves
  // -------------------------------------------------------------------------------------
  saveHandler() {
    const contentState = this.state.editorState.getCurrentContent(); 
    console.log('contentState = ', contentState);

    const stringifiedContent = JSON.stringify(convertToRaw(contentState));
    console.log('stringifiedContent', stringifiedContent);

    axios.post('http://localhost:3000/saveDoc', {
      docId: this.props.docId,
      editorState: stringifiedContent
    }) 
    .then((res)=> {
      console.log('Updates saved to the server!');
    })
    .catch((err)=> {
      console.log("Error! : ", err);
    });
  }

  render() {
    return (
      <div>
        <Link to='/Portal'>Home</Link>
        <h1>{this.props.title}</h1>
        <h3>ID: {this.props.docId}</h3>
        <RaisedButton 
          backgroundColor={colors.blue100}
          onClick={()=>this.saveHandler()}
          label="Save"
        /> 
        <div className='toolbar'>
          {this.formatButton({icon: 'format_bold', style: 'BOLD'})}
          {this.formatButton({icon: 'format_italics', style: 'ITALIC'})}
          {this.formatButton({icon: 'format_underlined', style: 'UNDERLINE'})}
          {this.colorPicker()}
          {this.formatButton({icon: 'format_list_numbered', style: 'ordered-list-item', block: true})}
          {this.formatButton({icon: 'list', style: 'unordered-list-item', block: true})}
          {this.formatButton({icon: 'format_align_left', style: 'ordered-list-item', block: true})}
          {this.formatButton({icon: 'format_align_center', style: 'center', block: true})}
          {this.formatButton({icon: 'format_align_right', style: 'ordered-list-item', block: true})}
        </div>
        <Editor
          blockRenderMap={myBlockTypes}
          editorState={this.state.editorState} 
          onChange={this.onChange.bind(this)}
          customStyleMap={this.state.inlineStyles}
        />
      </div>
    );
  }
}

export default Document;
