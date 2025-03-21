$(document).ready(function(){
    $("#fileImage").change(function(){
    	fileSize = this.files[0].size;
    	if(fileSize > 1048576){
    		this.setCustomValidity("The file must be lower than 1MB");
    		this.reportValidity();
    	}else {
    		this.setCustomValidity("");
    		showImageThumbnail(this);
    	}
    })
});
function showImageThumbnail(fileInput){
   var file = fileInput.files[0];
   console.log(file);
   var reader = new FileReader();
   reader.onload = function(e){
	   $("#thumbnail").attr("src" , e.target.result);
   }
   reader.readAsDataURL(file);
}