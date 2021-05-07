
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
    console.log('ok')
    $('#confirm-post-dialog').modal('show')
})
CKEDITOR.replace('txtContent')
$('#btnUpload').click(e=>{
    var Title = $('#title').val()
    var chude = $('input[name="chude"]:checked').val()
    txtContent =  CKEDITOR.instances['txtContent'].getData()
    if(title===''||chude===''||txtContent===''){
        $('#error').removeAttr('style')
        $('#error').val("Vui lòng nhập đầy đủ thông tin")
    }else{
        let data ={
            title:Title,
            context:txtContent,
            permission:chude
        }
        // console.log(data)
        fetch('http://localhost:8080/khoa/upload',{method:'POST',body: JSON.stringify(data)})
        .then(res=>res.json())
        .then(json=>{
            console.log(json)
            title=''
            chude=''
            txtContent=''
            $('#confirm-post-dialog').modal('hide')
        })
        .catch(e=>console.log(e))
    }
})
