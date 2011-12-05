/*

Uniform v1.7.5
Copyright © 2009 Josh Pyles / Pixelmatrix Design LLC
http://pixelmatrixdesign.com

Requires jQuery 1.4 or newer

Much thanks to Thomas Reynolds and Buck Wilson for their help and advice on this

Disabling text selection is made possible by Mathias Bynens <http://mathiasbynens.be/>
and his noSelect plugin. <http://github.com/mathiasbynens/noSelect-jQuery-Plugin>

Also, thanks to David Kaneda and Eugene Bond for their contributions to the plugin

License:
MIT License - http://www.opensource.org/licenses/mit-license.php

Enjoy!

*/

(function($) {
  $.uniform = {
    options: {
      selectClass:   'selector',
      radioClass: 'radio',
      checkboxClass: 'checker',
      fileClass: 'uploader',
      filenameClass: 'filename',
      fileBtnClass: 'action',
      fileDefaultText: 'No file selected',
      fileBtnText: 'Choose File',
      checkedClass: 'checked',
      focusClass: 'focus',
      disabledClass: 'disabled',
      buttonClass: 'button',
      activeClass: 'active',
      hoverClass: 'hover',
      useID: true,
      idPrefix: 'uniform',
      resetSelector: false,
      autoHide: true
    },
    elements: []
  };
  var status = {
    APPLIED: 0,
    DISABLED: 1
  };
  var types = {
    BUTTON: "0",
    SELECT: "1",
    CHECKBOX: "2",
    RADIO: "3",
    FILE: "4",
    INPUT: "5",
    TEXTAREA: "6"
  };

  if($.browser.msie && $.browser.version < 7){
    $.support.selectOpacity = false;
  }else{
    $.support.selectOpacity = true;
  }

  var options = $.uniform.options;

  var Do = {};
  Do[types.BUTTON] = function(elem){
    var $el = $(elem);
    
    var divTag = $("<div>"),
        spanTag = $("<span>");
    
    divTag.addClass(options.buttonClass);
    
    if(options.useID && $el.attr("id") != "") divTag.attr("id", options.idPrefix+"-"+$el.attr("id"));
    
    var btnText;
    
    if($el.is("a, button")){
      btnText = $el.text();
    }else if($el.is(":submit, :reset, input[type=button]")){
      btnText = $el.attr("value");
    }
    
    btnText = btnText == "" ? $el.is(":reset") ? "Reset" : "Submit" : btnText;
    
    spanTag.html(btnText);
    
    $el.css("opacity", 0);
    $el.wrap(divTag);
    $el.wrap(spanTag);
    
    //redefine variables
    divTag = $el.closest("div");
    spanTag = $el.closest("span");
    
    if($el.is(":disabled")) divTag.addClass(options.disabledClass);
    
    divTag.bind({
      "mouseenter.uniform": function(){
        divTag.addClass(options.hoverClass);
      },
      "mouseleave.uniform": function(){
        divTag.removeClass(options.hoverClass);
        divTag.removeClass(options.activeClass);
      },
      "mousedown.uniform touchbegin.uniform": function(){
        divTag.addClass(options.activeClass);
      },
      "mouseup.uniform touchend.uniform": function(){
        divTag.removeClass(options.activeClass);
      },
      "click.uniform touchend.uniform": function(e){
        if($(e.target).is("span") || $(e.target).is("div")){    
          if(elem[0].dispatchEvent){
            var ev = document.createEvent('MouseEvents');
            ev.initEvent( 'click', true, true );
            elem[0].dispatchEvent(ev);
          }else{
            elem[0].click();
          }
        }
      }
    });
    
    elem.bind({
      "focus.uniform": function(){
        divTag.addClass(options.focusClass);
      },
      "blur.uniform": function(){
        divTag.removeClass(options.focusClass);
      }
    });
    $.uniform.noSelect(divTag);
    storeElement(elem);
  };

  Do[types.SELECT] = function(elem){
    var $el = $(elem);
    
    var divTag = $('<div />'),
        spanTag = $('<span />');
    
    if(!$el.css("display") == "none" && options.autoHide){
      divTag.hide();
    }

    divTag.addClass(options.selectClass);

    if(options.useID && elem.attr("id") != ""){
      divTag.attr("id", options.idPrefix+"-"+elem.attr("id"));
    }
    
    var selected = elem.find(":selected:first");
    if(selected.length == 0){
      selected = elem.find("option:first");
    }
    spanTag.html(selected.html());
    
    elem.css('opacity', 0);
    elem.wrap(divTag);
    elem.before(spanTag);

    //redefine variables
    divTag = elem.parent("div");
    spanTag = elem.siblings("span");

    elem.bind({
      "change.uniform": function() {
        spanTag.text(elem.find(":selected").html());
        divTag.removeClass(options.activeClass);
      },
      "focus.uniform": function() {
        divTag.addClass(options.focusClass);
      },
      "blur.uniform": function() {
        divTag.removeClass(options.focusClass);
        divTag.removeClass(options.activeClass);
      },
      "mousedown.uniform touchbegin.uniform": function() {
        divTag.addClass(options.activeClass);
      },
      "mouseup.uniform touchend.uniform": function() {
        divTag.removeClass(options.activeClass);
      },
      "click.uniform touchend.uniform": function(){
        divTag.removeClass(options.activeClass);
      },
      "mouseenter.uniform": function() {
        divTag.addClass(options.hoverClass);
      },
      "mouseleave.uniform": function() {
        divTag.removeClass(options.hoverClass);
        divTag.removeClass(options.activeClass);
      },
      "keyup.uniform": function(){
        spanTag.text(elem.find(":selected").html());
      }
    });
    
    //handle disabled state
    if($(elem).attr("disabled")){
      //box is checked by default, check our box
      divTag.addClass(options.disabledClass);
    }
    $.uniform.noSelect(spanTag);
    
    storeElement(elem);

  };
  Do[types.CHECKBOX] = function(elem){
    var $el = $(elem);
    
    var divTag = $('<div />'),
        spanTag = $('<span />');
    
    if(!$el.css("display") == "none" && options.autoHide){
      divTag.hide();
    }
    
    divTag.addClass(options.checkboxClass);

    //assign the id of the element
    if(options.useID && elem.attr("id") != ""){
      divTag.attr("id", options.idPrefix+"-"+elem.attr("id"));
    }

    //wrap with the proper elements
    $(elem).wrap(divTag);
    $(elem).wrap(spanTag);

    //redefine variables
    spanTag = elem.parent();
    divTag = spanTag.parent();

    //hide normal input and add focus classes
    $(elem)
    .css("opacity", 0)
    .bind({
      "focus.uniform": function(){
        divTag.addClass(options.focusClass);
      },
      "blur.uniform": function(){
        divTag.removeClass(options.focusClass);
      },
      "click.uniform touchend.uniform": function(){
        if(!$(elem).attr("checked")){
          //box was just unchecked, uncheck span
          spanTag.removeClass(options.checkedClass);
        }else{
          //box was just checked, check span.
          spanTag.addClass(options.checkedClass);
        }
      },
      "mousedown.uniform touchbegin.uniform": function() {
        divTag.addClass(options.activeClass);
      },
      "mouseup.uniform touchend.uniform": function() {
        divTag.removeClass(options.activeClass);
      },
      "mouseenter.uniform": function() {
        divTag.addClass(options.hoverClass);
      },
      "mouseleave.uniform": function() {
        divTag.removeClass(options.hoverClass);
        divTag.removeClass(options.activeClass);
      }
    });
    
    //handle defaults
    if($(elem).attr("checked")){
      //box is checked by default, check our box
      spanTag.addClass(options.checkedClass);
    }

    //handle disabled state
    if($(elem).attr("disabled")){
      //box is checked by default, check our box
      divTag.addClass(options.disabledClass);
    }

    storeElement(elem);
  }
  Do[types.RADIO] = function(elem){
    var $el = $(elem);
    
    var divTag = $('<div />'),
        spanTag = $('<span />');
        
    if(!$el.css("display") == "none" && options.autoHide){
      divTag.hide();
    }

    divTag.addClass(options.radioClass);

    if(options.useID && elem.attr("id") != ""){
      divTag.attr("id", options.idPrefix+"-"+elem.attr("id"));
    }

    //wrap with the proper elements
    $(elem).wrap(divTag);
    $(elem).wrap(spanTag);

    //redefine variables
    spanTag = elem.parent();
    divTag = spanTag.parent();

    //hide normal input and add focus classes
    $(elem)
    .css("opacity", 0)
    .bind({
      "focus.uniform": function(){
        divTag.addClass(options.focusClass);
      },
      "blur.uniform": function(){
        divTag.removeClass(options.focusClass);
      },
      "click.uniform touchend.uniform": function(){
        if(!$(elem).attr("checked")){
          //box was just unchecked, uncheck span
          spanTag.removeClass(options.checkedClass);
        }else{
          //box was just checked, check span
          var classes = options.radioClass.split(" ")[0];
          $("." + classes + " span." + options.checkedClass + ":has([name='" + $(elem).attr('name') + "'])").removeClass(options.checkedClass);
          spanTag.addClass(options.checkedClass);
        }
      },
      "mousedown.uniform touchend.uniform": function() {
        if(!$(elem).is(":disabled")){
          divTag.addClass(options.activeClass);
        }
      },
      "mouseup.uniform touchbegin.uniform": function() {
        divTag.removeClass(options.activeClass);
      },
      "mouseenter.uniform touchend.uniform": function() {
        divTag.addClass(options.hoverClass);
      },
      "mouseleave.uniform": function() {
        divTag.removeClass(options.hoverClass);
        divTag.removeClass(options.activeClass);
      }
    });

    //handle defaults
    if($(elem).attr("checked")){
      //box is checked by default, check span
      spanTag.addClass(options.checkedClass);
    }
    //handle disabled state
    if($(elem).attr("disabled")){
      //box is checked by default, check our box
      divTag.addClass(options.disabledClass);
    }

    storeElement(elem);

  }
  Do[types.FILE] = function doFile(elem){
      //sanitize input
    var $el = $(elem);

    var divTag = $('<div />'),
        filenameTag = $('<span>' + options.fileDefaultText + '</span>'),
        btnTag = $('<span>' + options.fileBtnText + '</span>');
    
    if(!$el.css("display") == "none" && options.autoHide){
      divTag.hide();
    }

    divTag.addClass(options.fileClass);
    filenameTag.addClass(options.filenameClass);
    btnTag.addClass(options.fileBtnClass);

    if(options.useID && $el.attr("id") != ""){
      divTag.attr("id", options.idPrefix + "-" + $el.attr("id"));
    }

    //wrap with the proper elements
    $el.wrap(divTag);
    $el.after(btnTag);
    $el.after(filenameTag);

    //redefine variables
    divTag = $el.closest("div");
    filenameTag = $el.siblings("." + options.filenameClass);
    btnTag = $el.siblings("." + options.fileBtnClass);

    //set the size
    if(!$el.attr("size")){
      var divWidth = divTag.width();
      //$el.css("width", divWidth);
      $el.attr("size", divWidth / 10);
    }

    //actions
    var setFilename = function(){
      var filename = $el.val() || options.fileDefaultText;
      if (filename !== options.fileDefaultText){
        filename = filename.split(/[\/\\]+/).pop();
      }
      filenameTag.text(filename);
    };

    // Account for input saved across refreshes
    setFilename();

    $el
    .css("opacity", 0)
    .bind({
      "focus.uniform": function(){
        divTag.addClass(options.focusClass);
      },
      "blur.uniform": function(){
        divTag.removeClass(options.focusClass);
      },
      "mousedown.uniform": function(){
        if(!$(elem).is(":disabled")){
          divTag.addClass(options.activeClass);
        }
      },
      "mouseup.uniform": function() {
        divTag.removeClass(options.activeClass);
      },
      "mouseenter.uniform": function() {
        divTag.addClass(options.hoverClass);
      },
      "mouseleave.uniform": function() {
        divTag.removeClass(options.hoverClass);
        divTag.removeClass(options.activeClass);
      }
    });

    // IE7 doesn't fire onChange until blur or second fire.
    if ($.browser.msie){
      // IE considers browser chrome blocking I/O, so it
      // suspends tiemouts until after the file has been selected.
      $el.bind('click.uniform.ie7', function() {
        setTimeout(setFilename, 0);
      });
    }else{
      // All other browsers behave properly
      $el.bind('change.uniform', setFilename);
    }

    //handle defaults
    if($el.attr("disabled")){
      //box is checked by default, check our box
      divTag.addClass(options.disabledClass);
    }
    
    $.uniform.noSelect(filenameTag);
    $.uniform.noSelect(btnTag);
    
    storeElement(elem);

  };
  Do[types.INPUT] = function(elem){
    $el = $(elem);
    $el.addClass($el.attr("type"));
    storeElement(elem);
  };

  Do[types.TEXTAREA] = function(elem){
    $(elem).addClass("uniform");
    storeElement(elem);
  };

  

  function storeElement(elem){
    //store this element in our global array
    elem = $(elem).get();
    if(elem.length > 1){
      $.each(elem, function(i, val){
        $.uniform.elements.push(val);
      });
    }else{
      $.uniform.elements.push(elem);
    }
  };
  

  function elementType(elem){
    var type = elem.data("uniformType");
    if(!type){
      if(elem.is("select")){
          //element is a select
        if(elem.attr("multiple") != true){
          //element is not a multi-select
          if(elem.attr("size") == undefined || elem.attr("size") <= 1){
            type = types.SELECT;
          }
        }
      }else if(elem.is(":checkbox")){
        //element is a checkbox
        type = types.CHECKBOX;
      }else if(elem.is(":radio")){
        //element is a radio
        type = types.RADIO;
      }else if(elem.is(":file")){
        //element is a file upload
        type = types.FILE;
      }else if(elem.is(":text, :password, input[type='email']")){
        type = types.INPUT;
      }else if(elem.is("textarea")){
        type = types.TEXTAREA;
      }else if(elem.is(":submit, :reset, button, a, input[type=button]")){
        type = types.BUTTON;
      }
      elem.data("uniformType", type);
    }
    return type;
  };

  var updateElement = (function(uniform){
    var cleanClasses = function(divTag, element){
      if(divTag){
        divTag.removeClass(options.hoverClass + " " + options.focusClass + " " + options.activeClass);
        if(element.is(":disabled")){
          divTag.addClass(options.disabledClass);
        }else{
          divTag.removeClass(options.disabledClass);
        }
      }
    };

    var update = {};

    update[types.BUTTON] = function(element){
      cleanClasses(element.closest("div"), element);
    };

    update[types.SELECT] = function(element){
      var spanTag = element.siblings("span");
      //reset current selected text
      spanTag.html(element.find(":selected").html());
      cleanClasses(element.parent("div"), element);
    };

    update[types.CHECKBOX] = function(element){
      var spanTag = element.closest("span");
      spanTag.removeClass(options.checkedClass);
      if(element.is(":checked")){
        spanTag.addClass(options.checkedClass);
      }
      cleanClasses(element.closest("div"), element);
    };

    update[types.RADIO] = update[types.CHECKBOX];

    update[types.FILE] = function(element){
      var filenameTag = element.siblings(options.filenameClass);
      btnTag = element.siblings(options.fileBtnClass);
      filenameTag.text(element.val());
      cleanClasses(element.parent("div"), element);
    };

    return function(element){
      //function to reset all classes
      var type = elementType(element);
      update[type] && update[type](element);
    }
  })($.uniform);

  //noSelect v1.0
  $.uniform.noSelect = function(elem) {
    function f() {
     return false;
    };
    $(elem).each(function() {
     this.onselectstart = this.ondragstart = f; // Webkit & IE
     $(this)
      .mousedown(f) // Webkit & Opera
      .css({ MozUserSelect: 'none' }); // Firefox
    });
  };

  $.uniform.restore = function(elements){
    if(elements === undefined){
      elements = $.uniform.elements;
    }
    
    $(elements).each(function(){
      var elem = $(this);
      var type = elementType(elem);
      switch(type){
        case types.CHECKBOX:
        case types.RADIO:
        case types.BUTTON:
          elem.unwrap().unwrap(); break;
        case types.SELECT:
        case types.FILE: 
          //remove sibling span
          elem.siblings("span").remove();
          //unwrap parent div
          elem.unwrap();
          break;
        default: break;
      }

      //unbind events
      elem.unbind(".uniform");
      //reset inline style
      elem.css("opacity", "1");
      
      //remove item from list of uniformed elements
      var index = $.inArray($(elem), $.uniform.elements);
      $.uniform.elements.splice(index, 1);
    });
  };

  $.uniform.update = function(elem){
    if(!elem){
      elem = $.uniform.elements;
    }

    $(elem).each(function(){
      //do to each item in the selector
      updateElement($(this))
    });
  };

  $.fn.uniform = function(new_options) {

    options = $.extend($.uniform.options, new_options);

    var el = this;
    //code for specifying a reset button
    if(options.resetSelector != false){
      $(options.resetSelector).mouseup(function(){
        function resetThis(){
          $.uniform.update(el);
        }
        setTimeout(resetThis, 10);
      });
    }

    return this.each(function() {
      if($.support.selectOpacity){
        var elem = $(this);
        if(elem.data("uniformStatus") == status.APPLIED){
          return;
        }
        var type = elementType(elem);
        Do[type] && Do[type](elem);
        elem.data("uniformStatus", status.APPLIED);
      }
    });
  };
})(jQuery);