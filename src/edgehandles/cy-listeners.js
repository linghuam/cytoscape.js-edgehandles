const throttle = require('lodash.throttle');
function addCytoscapeListeners(){
  let { cy, options } = this;

  // grabbing nodes
  this.addListener( cy, 'drag', () => this.grabbingNode = true );
  this.addListener( cy, 'free', () => this.grabbingNode = false );

  // show handle on hover
  // this.addListener( cy, 'mouseover', 'node', e => {
  //   this.show( e.target );
  // } );

  // hide handle on tap handle
  // this.addListener( cy, 'tap', 'node', e => {
  //   let node = e.target;

  //   if( !node.same( this.handleNode ) ){
  //     this.show( node );
  //   }
  // } );

  // hide handle when source node moved
  // this.addListener( cy, 'position', 'node', e => {
  //   if( e.target.same( this.sourceNode ) ){
  //     this.hide();
  //   }
  // } );
  
  this.addListener( cy, 'mousemove', throttle(function(e) {
    if (e.target !== cy || this.active || this.grabbingNode) {
      this.hide();
      return;
    }
    let node = this.getClickNode(e);
    if (node) {
      if( !this.canStartOn(node) || ( this.drawMode && !options.handleInDrawMode ) ){ 
        this.hide();
        return; 
      }
      this.show( node, e.position );
    } else {
      this.hide();
    }
  }.bind(this), options.hoverDelay));

  // start on tapstart handle
  // start on tapstart node (draw mode)
  // toggle on source node
  // 鼠标点下触发，click
  this.addListener( cy, 'tapstart', e => {
    let node = e.target;

    // if( node.same( this.handleNode ) ){
    //   this.start( this.sourceNode );
    // } else if( this.drawMode ){
    //   this.start( node );
    // } else if( node.same( this.sourceNode ) ){
    //   this.hide();
    // }
      
    if (this.handleShown() && this.handleNode.length && this.sourceNode.length) {
      this.hide();
      this.start(this.sourceNode);
    }
    // if (node === cy) {
    //   // 点击空白
    //   let clickNode = this.getClickNode(e);
    //   if (clickNode) {
    //     if( !this.canStartOn(clickNode) || ( this.drawMode && !options.handleInDrawMode ) ){ return; }
    //     this.start(clickNode);
    //     // console.log('clickNode', clickNode);
    //     // this.show(clickNode, e.position);
    //     // if (this.sourceNode) {
    //     //   // this.hide();
    //     //   this.start(this.sourceNode);
    //     // }
    //     // this.start(clickNode);
    //   }
    // }
  } );

  // update line on drag
  // 鼠标移动触发，mousemove
  this.addListener( cy, 'tapdrag', e => {
    this.update( e.position );
  } );

  // hover over preview
  // this.addListener( cy, 'tapdragover', 'node', e => {
  //   if( options.snap ){
  //     // then ignore events like mouseover
  //   } else {
  //     this.preview( e.target );
  //   }
  // } );

  // hover out unpreview
  // this.addListener( cy, 'tapdragout', 'node', e => {
  //   if( options.snap ){
  //     // then keep the preview
  //   } else {
  //     this.unpreview( e.target );
  //   }
  // } );

  // stop gesture on tapend
  // 每次鼠标抬起触发，mouseup
  this.addListener( cy, 'tapend', e => {
    if (this.active && e.target !== this.cy && e.target.isNode()) {
      this.targetNode = e.target;
    }
    this.stop();
  } );

  // hide handle if source node is removed
  this.addListener( cy, 'remove', e => {
    if( e.target.same( this.sourceNode ) ){
      this.hide();
    }
  } );

  return this;
}

module.exports = { addCytoscapeListeners };
