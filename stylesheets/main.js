var c = 0
$('.menu-toggle').click(e=>{
    if(c%2==0){
        $('.left').hide()
        $('.right').css('width','100%')
        c=c+1
    }else{
        $('.left').show()
        $('.right').css('width','')
        c=c+1
        $('.left').css('transition','1s')
    }
   
})
$('#post').click(e=>{
    $('#confirm-post-dialog').modal('show')
})
CKEDITOR.replace('txtContent')