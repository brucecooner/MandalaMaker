var GraphicsCommands =
{
   // constant names for commands
   cmd_line:'line',
   cmd_clear:'clear',
   cmd_circle:'circle',

   // functions that return graphics command objects
   clear:function()
   { return {command:'clear'}},

   line:function(lineStart, lineEnd)
   { return { command:'line', parameters:{lineStart:lineStart, lineEnd:lineEnd} } },

   circle:function(x, y, r)
   { return { command:'circle', parameters:{x:x, y:y, r:r} } },
}
