/*!
 *
 * # BiB/i Extention: EPUBCFI Utilities
 *
 * - "EPUBCFI Utilities for BiB/i"
 * - Copyright (c) Satoru MATSUSHIMA - http://bibi.epub.link/ or https://github.com/satorumurmur/bibi
 * - Licensed under the MIT license. - http://www.opensource.org/licenses/mit-license.php
 *
 * - Thu May 28 20:28:00 2015 +0900
 */
Bibi.x({name:"EPUBCFI",description:"EPUBCFI Utilities for BiB/i",author:"Satoru MATSUSHIMA (@satorumurmur)",version:Bibi.version,build:Bibi.build,CFIString:"",Current:0,Log:!1,LogCorrection:!1,LogCancelation:!1,parse:function(a,b){if(!a||"string"!=typeof a)return null;try{a=decodeURIComponent(a)}catch(c){return this.log(0,"Unregulated URIEncoding."),null}return b&&"string"==typeof b&&"function"==typeof this["parse"+b]||(b="Fragment"),"Fragment"==b&&(a=a.replace(/^(epubcfi\()?/,"epubcfi(").replace(/(\))?$/,")")),this.CFIString=a,this.Current=0,this.Log&&this.LogCancelation&&(this.log(1,"BiB/i EPUB-CFI"),this.log(2,"parse"),this.log(3,"CFIString: "+this.CFIString)),this["parse"+b]()},parseFragment:function(){var a=this.Current,b={};return this.parseString("epubcfi(")?(b=this.parseCFI(),null===b?this.cancel(a):this.parseString(")")?b:this.cancel(a,"Fragment")):this.cancel(a,"Fragment")},parseCFI:function(){var a=this.Current,b={Type:"CFI",Path:{}};if(b.Path=this.parsePath(),!b.Path)return this.cancel(a,"CFI");if(this.parseString(",")){if(b.Start=this.parseLocalPath(),!b.Start.Steps.length&&!b.Start.TermStep)return this.cancel(a,"CFI > Range");if(!this.parseString(","))return this.cancel(a,"CFI > Range");if(b.End=this.parseLocalPath(),!b.End.Steps.length&&!b.End.TermStep)return this.cancel(a,"CFI > Range")}return b},parsePath:function(){var a=this.Current,b={Type:"Path",Steps:[]},c={};return b.Steps[0]=this.parseStep(),b.Steps[0]&&(c=this.parseLocalPath())?(b.Steps=b.Steps.concat(c.Steps),b):this.cancel(a,"Path")},parseLocalPath:function(){var a=(this.Current,{Type:"LocalPath",Steps:[]}),b=a,c=null,d=null;for(c=this.parseStep("Local");null!==c&&(b.Steps.push(c),c=this.parseStep("Local"));)if("IndirectStep"==c.Type){var e={Type:"IndirectPath",Steps:[]};b.Steps.push(e),b=e}else if("TermStep"==c.Type){d=c;break}return d&&b.Steps.push(d),a.Steps.length?a:null},parseStep:function(a){var b=this.Current,c={};if(this.parseString("/"))c.Type="Step";else if(a&&this.parseString("!/"))c.Type="IndirectStep";else{if(!a||!this.parseString(":"))return this.cancel(b,"Step");c.Type="TermStep"}if(c.Index=this.parseString(/^(0|[1-9][0-9]*)/),null===c.Index)return this.cancel(b,"Step");if(c.Index=parseInt(c.Index),this.parseString("[")){if("TermStep"!=c.Type){if(c.ID=this.parseString(/^[a-zA-Z_:][a-zA-Z0-9_:\-\.]+/),!c.ID)return this.cancel(b,"Step > Assertion > ID")}else{var d=[],e=null,f=/^((\^[\^\[\]\(\)\,\;\=])|[_a-zA-Z0-9%\- ])*/;if(d.push(this.parseString(f)),this.parseString(",")&&d.push(this.parseString(f)),d[0]&&(c.Preceding=d[0]),d[1]&&(c.Following=d[1]),this.parseString(/^;s=/)&&(e=this.parseString(/^[ab]/)),e&&(c.Side=e),!c.Preceding&&!c.Following&&!c.Side)return this.cancel(b,"Step > Assertion > TextLocation")}if(!this.parseString("]"))return this.cancel(b,"Step > Assertion")}return c},parseString:function(a){var b=null;if(a instanceof RegExp){var c=this.CFIString.substr(this.Current,this.CFIString.length-this.Current);a.test(c)&&(a=c.match(a)[0],this.Current+=a.length,b=a)}else this.CFIString.substr(this.Current,a.length)===a&&(this.Current+=a.length,b=a);return this.correct(b)},correct:function(a){return this.Log&&this.LogCorrection&&a&&this.log(3,a),a},cancel:function(a,b){return this.Log&&this.LogCancelation&&this.log(4,"cancel: parse"+b+" ("+a+"-"+this.Current+"/"+this.CFIString.length+")"),"number"==typeof a&&(this.Current=a),null},log:function(a,b){this.Log&&console&&console.log&&(0==a?b="[ERROR] "+b:1==a?b="---------------- "+b+" ----------------":2==a?b=b:3==a?b=" - "+b:4==a&&(b="   . "+b),console.log("BiB/i EPUB-CFI: "+b))}});