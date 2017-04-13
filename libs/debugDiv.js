$(document).ready( function()
{
   newDiv = document.createElement('div')

   newDiv.id = 'debugDiv'
   newDiv.style.position = 'fixed'
   newDiv.style.right = '0px'
   newDiv.style.top = '0px'
   newDiv.style['background-color'] = 'darkred'
   newDiv.style.width = '250px'
   newDiv.style.height = '100px'
   newDiv.style.border = '5px'
   newDiv.style['border-color'] = 'gray'
   newDiv.style['border-style'] = 'solid'
   newDiv.style['font-size'] = '75%'
   newDiv.style.display = 'none'

   $('body').append(newDiv)
})

DebugDiv = {
   add:function(msgId, msg)
   {
      debugDivEl = document.getElementById('debugDiv')

      if (null != debugDivEl)
      {
         found = false
         $(`#debugDiv > #${msgId}`).each( function()
         {
            if (msgId == this.id)
            {
               this.innerHTML = msg
               found = true
               return false
               }
         })

         if (false == found)
         {
            newPara = document.createElement('p')
            newPara.id = msgId
            newPara.style.color = 'white'
            newPara.innerHTML = msg
            newPara.style.margin = '5px'
            document.getElementById('debugDiv').appendChild(newPara)
         }
      }
      else
      {
         console.log('debugDiv - no div yet')
      }
   }

}
