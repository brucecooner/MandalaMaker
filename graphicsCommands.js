var GraphicsCommands =
{
   // constant names for commands
   // output commands
   cmd_clear:'clear',
   cmd_line:'line',
   cmd_circle:'circle', // TODO : implement
   // state commands
   cmd_setLineDash:'setLineDash',

   // functions that return graphics command objects
   clear:function()
   { return {command:'clear'}},

   line:function(lineStart, lineEnd)
   { return { command:'line', parameters:{lineStart:lineStart, lineEnd:lineEnd} } },

   circle:function(x, y, r)
   { return { command:'circle', parameters:{x:x, y:y, r:r} } },

   setLineDash:function(dashSequence)
   { return { command:'setLineDash', parameters:{dashSequence}}},
}
