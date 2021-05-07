
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

function onSignIn(googleUser) {
    var id_token = googleUser.getAuthResponse().id_token;
    console.log(id_token)
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/loginGG');
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = function() {
        if (xhr.responseText == 'success') {
            signOut();
            location.assign('/student')
        }
    };
    xhr.send(JSON.stringify({
        token: id_token
    }));
}

function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
      console.log('User signed out.');
    });
  }
