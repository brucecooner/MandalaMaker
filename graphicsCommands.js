var GraphicsCommands =
{
   // constant names for commands
   // output commands
   cmd_clear:'clear',
   cmd_line:'line',
   cmd_circle:'circle',
   // state commands
   cmd_setLineDash:'setLineDash',   // TODO : make a draw param
   cmd_setDrawParameter:'setDrawParameter',
   cmd_clear_transform:'clearTransform',
   cmd_quadraticCurve:'quadraticCurve',

   // functions that return graphics command objects
   clear:function()
   { return {command:'clear'}},

   line:function(lineStart, lineEnd)
   { return { command:'line', parameters:{p1:lineStart, p2:lineEnd} } },

   circle:function(x, y, radius)
   { return { command:'circle', parameters:{x, y, radius} } },

   setLineDash:function(dashSequence)
   { return { command:'setLineDash', parameters:{dashSequence}}},

   setDrawParameter:function(parameterName, value)
   { return { command:'setDrawParameter', parameters:{parameterName, value} }},

   clearTransform:function()
   { return {command:'clearTransform'}},

   quadraticCurve:function( p1, p2, p3)
   { return { command:'quadraticCurve', parameters:{p1, p2, p3}}}
}
