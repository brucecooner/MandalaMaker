var GraphicsCommands =
{
   // constant names for commands
   // output commands
   cmd_clear:'clear',
   cmd_line:'line',
   cmd_circle:'circle', 
   // state commands
   cmd_setLineDash:'setLineDash',

   // functions that return graphics command objects
   clear:function()
   { return {command:'clear'}},

   line:function(lineStart, lineEnd)
   { return { command:'line', parameters:{P1:lineStart, P2:lineEnd} } },

   circle:function(x, y, radius)
   { return { command:'circle', parameters:{x, y, radius} } },

   setLineDash:function(dashSequence)
   { return { command:'setLineDash', parameters:{dashSequence}}},
}
