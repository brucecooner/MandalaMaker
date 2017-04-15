'use strict';

// TODO: may have issues if used before doc is ready, not seen yet tho
(function() {
   window.debugDiv = {}

   debugDiv.enabled = false;

   // --------------------------------------------------------------------------
   debugDiv.getDiv = function() {
      let $debugDiv = $('#debugDiv');

      if (0 === $debugDiv.length)
      {
         let newDiv = document.createElement('div');

         newDiv.id = 'debugDiv';
         newDiv.style.position = 'fixed';
         newDiv.style.right = '0px';
         newDiv.style.top = '0px';
         newDiv.style['background-color'] = 'darkred';
         newDiv.style.width = '250px';
         newDiv.style.height = 'auto'; //'100px'
         newDiv.style.border = '5px';
         newDiv.style['border-color'] = 'gray';
         newDiv.style['border-style'] = 'solid';
         newDiv.style['font-size'] = '75%';

         $('body').append(newDiv);

         $debugDiv = $('#debugDiv');
      }

      return $debugDiv;
   }

   // --------------------------------------------------------------------------
   debugDiv.add = function(msgId, msg) {
      if (debugDiv.enabled) {
         let $debugDiv = debugDiv.getDiv();

         let $para = $(`#debugDiv > #${msgId}`)

         if ($para.length) {
            $para.text(msg);
         }
         else {
            let newPara = document.createElement('p');
            newPara.id = msgId;
            newPara.style.color = 'white';
            newPara.innerHTML = msg;
            newPara.style.margin = '5px';
            $debugDiv.append(newPara);
         }
      }
   }

   // --------------------------------------------------------------------------
   debugDiv.remove = function(msgId)
   {
      $(`#debugDiv > #${msgId}`).remove();
   }

}())
