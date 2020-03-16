var editor;

$(document).ready(function(){

  editor = CodeMirror.fromTextArea(document.getElementById("code"), {
    value: "function myScript(){\n\treturn 100;\n}\n",
    mode: "text/x-csrc",
    lineNumbers: true,
    styleActiveLine: true,
    smartIndent: true,
    search: true,
    matchBrackets: true,
    autoCloseBrackets: true,
    viewportMargin: Infinity,
    theme: 'duotone-dark'
  });

  editor.setSize("100%", (window.innerHeight)*.7); //set editor height to be 70% of users window

  editor.setValue(`#include <stdio.h>
#include <fcntl.h>
#include <stdlib.h>
#include <unistd.h>
#include <sys/stat.h>

int main(int argc, char** argv){

  return 0;
}`);

  setTimeout(function(){

    var edit = editor.getValue();
       console.log(edit);

  }, 4000);

  var term = new Terminal();
  term.open(document.getElementById('terminal'));
  term.write('Hello from \x1B[1;3;31mxterm.js\x1B[0m $ ');

    function runFakeTerminal() {
        if (term._initialized) {
            return;
        }

        term._initialized = true;

        term.prompt = () => {
            term.write('\r\n$ ');
        };

        term.writeln('Welcome to xterm.js');
        term.writeln('This is a local terminal emulation, without a real terminal in the back-end.');
        term.writeln('Type some keys and commands to play around.');
        term.writeln('');
        prompt(term);

        term.onKey(e => {
            const printable = !e.domEvent.altKey && !e.domEvent.altGraphKey && !e.domEvent.ctrlKey && !e.domEvent.metaKey;

            if (e.domEvent.keyCode === 13) {
                prompt(term);
            } else if (e.domEvent.keyCode === 8) {
                // Do not delete the prompt
                if (term._core.buffer.x > 2) {
                    term.write('\b \b');
                }
            } else if (printable) {
                term.write(e.key);
            }
        });
    }

    function prompt(term) {
      term.write('\r\n$ ');
    }
    runFakeTerminal();

});

$("#theme").change(function(){
  actions.changeTheme();
});

var actions = {

  sendCode: function(){
  },

  setCodePreset: function(language){

  },

  changeTheme: function(theme){
    var theme = $("#theme option:selected").text();
    editor.setOption("theme", theme);
  }
}
