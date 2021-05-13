
let socket 

let onlineUser=[]
let username
  window.onload=()=>{
    socket= io()
    socket.on('connect',()=>{
      console.log("đã kết nối socket thành công id= ",socket.id)
    })
    $("#online-notification").fadeTo(10,0)
    $("#offline-notification").fadeTo(10,0)
    socket.on('disconnect',()=>console.log("đã mất kết nối đến server"))
    socket.on('error',()=>console.log("đã xảy ra lỗi: ",e.message))
    //Xu ly thong bao moi
    $('#btnUpload').click(e=>{
      var Title = $('#title').val()
      var chude = $('input[name="chude"]:checked').val()
      var txtContent =  CKEDITOR.instances['txtContent'].getData()
      if(Title===''||chude===''||txtContent===''){
          $('#error').removeAttr('style')
          $('#error').val("Vui lòng nhập đầy đủ thông tin")
      }else{
          let data ={
              title:Title,
              context:txtContent,
              permission:chude,
              name:$('#name').text()
          }
          // console.log(data)
          fetch('http://localhost:8080/khoa/upload',{method:'POST',body: JSON.stringify(data)})
          .then(res=>res.json())
          .then(json=>{
            if(json.code===0){
              title=''
              chude=''
              txtContent=''
              socket.emit('notify',json.data)
              $('#confirm-post-dialog').modal('hide')
              window.reload()
            }
              else{
              $('#error').removeAttr('style')
              $('#error').text('')
              $('#error').text("Đăng bài thất bại")
              }
          })
          .catch(e=>console.log(e))
        }
      }
      )  
      // THONG BAO 
      socket.on('alertNoti',s=>{
        let m = s.message
        console.log(m)
        notifyOnline(m)
      })
      
  }
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


$('#postStu').click(e=>{
  $('#confirm-postStu-dialog').modal('show')
})
//Update Information Student
$('#update').click(e=>{
    $('#confirm-update-dialog').modal('show')
})
$('#btnStudentUpdate').click(e=>{
  var nameStu = $('#nameStu').val()
  var classStu = $('#class').val()
  var facuStu = $('#facu').val()
  var emailStu = $('#emailStu').val()
  if(nameStu===''||classStu===''||facuStu===''){
      $('#error').removeAttr('style')
      $('#error').val("Vui lòng nhập đầy đủ thông tin")
  }else{
      let data ={
          emailStu: emailStu,
          name: nameStu,
          clas  : classStu,
          faculty: facuStu
      }
      fetch('http://localhost:8080/student/update',{method:'POST',body: JSON.stringify(data)})
        .then(res=>res.json())
        .then(json=>{
            name =''
            emailStu=''
            clas ='' 
            faculty=''
            
        })
        $('#confirm-update-dialog').modal('hide')
        .catch(e=>console.log(e)) 
  }
})

$('#btnStudentUpload').click(e =>{
  var titlePost = $('#titleStu').val()
  var txtContentPost =  CKEDITOR.instances['txtContentStu'].getData()
  console.log(titlePost)
  console.log(txtContentPost)
  if(titlePost===''|| txtContentPost===''){
      $('#error').removeAttr('style')
      $('#error').val("Vui lòng nhập đầy đủ thông tin")
  }else{
      let dataPost ={
          titlePost:titlePost,
          contextPost:txtContentPost,
      }
      console.log(dataPost)
      fetch('http://localhost:8080/student/upload',{method:'POST',body: JSON.stringify(dataPost)})
      .then(res=>res.json())
      .then(json=>{
        if(json.code===0){
          titlePost=''
          contextPost=''
      //     socket.emit('notify',json.data)
      $('#confirm-postStu-dialog').modal('hide')
      //     window.reload()
        }
          else{
            $('#error').removeAttr('style')
            $('#error').text('')
            $('#error').text("Đăng bài thất bại")
          }
      })
      .catch(e=>console.log(e))
    }
})

function notifyOnline(s){
$("#online-notification strong").html(s)
$("#online-notification").fadeTo(2000,1)//show
setTimeout(()=>{
    $('#online-notification').fadeTo(2000,0)// hide
},4000)
}
function remove(id){
$(`#${id}`).remove()
$("#online-count").html($('#user-list').length)// cập nhật lại số lượng sau khi xóa
}
  function notifyOffline(username){
    $("#offline-notification strong").html(username)
    $("#offline-notification").fadeTo(2000,1)//show
    setTimeout(()=>{
      $('#offline-notification').fadeTo(2000,0)// hide
    },4000)
  }
// EDIT
$(document).ready(()=>{
  //Hien thi thong tin de sua
  $('.edit').click(e=>{
    e.preventDefault()
    let id =$(e.target).data('id');
    $('.btnEdit').attr('data-id',id)
    console.log(id)
    fetch('http://localhost:8080/khoa/thongbao/',{
      method:'POST',
      headers:{
        'Content-Type':'application/x-www-form-urlencoded'
    },
    body:'id='+id  
    })
    .then(res=>res.json())
    .then(json=>{
      console.log(json)
      let d=json.data
      $('#titleE').val(d.title)
      txtContent1 =  CKEDITOR.instances['txtContent1'].setData(d.context)
    })
    .catch(e=>console.log(e))
    $('#confirm-edit-dialog').modal('show')
  })
  $('.btnEdit').click(e=>{
    console.log('ok')
    let idE =e.target.dataset.id;
    let titleE = $('#titleE').val()
    let chudeE = $('input[name="chudeE"]:checked').val()
    console.log("Chu de: ",chudeE)
    let facutily = $('#name').text()
    let txtContent1 =  CKEDITOR.instances['txtContent1'].getData()
    let data ={
      id:idE,
      title:titleE,
      permission:chudeE,
      context:txtContent1,
      faculity:facutily
    }
    console.log('data gui: ',data)
    if(titleE===''||chudeE===''||txtContent1===''){
      console.log('loi')
      $('#errorE').removeAttr('style')
      $('#errorE').text("Vui lòng nhập đầy đủ thông tin")
    }else{
      fetch('http://localhost:8080/khoa/thongbao/edit',{
        method:'POST',
      body:JSON.stringify(data)
      })
      .then(res=>res.json())
      .then(json=>{
        if(json.code === 1){
          $('#confirm-edit-dialog').modal('hide')
        }else{
          $('#errorE').removeAttr('style')
          $('#errorE').text("")
          $('#errorE').text(json.message)
        }
      })
      .catch(e=>console.log(e))
    }   
  })
      //DELETE
    $('.del').click(e=>{
      e.preventDefault()
      let id =$(e.target).data('id');
      console.log(id)
      $('#btn-delete-confirmed').attr('data-id',id)
      $('#confirm-delete-dialog').modal('show')
    })
    $('#btn-delete-confirmed').click(e=>{
      let id = e.target.dataset.id
      fetch('http://localhost:8080/khoa/thongbao/delete/'+id,{method:'POST'})
      .then(res=>res.json())
      .then(json => {
        if(json.code === 0){
          $('#confirm-delete-dialog').modal('hide')
          window.location.reload()
          console.log(json.message)
        }else{
          $('#errorD').removeAttr('style')
          $('#errorD').text("")
          $('#errorD').text(json.message)
        }
      
      })
      .catch(e=>console.log(e))
  })
})
// EDIT
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
//EDIT PASSWORD
$('#editPass').click(e=>{
$('#confirm-editPass-dialog').modal('show')
})
$('.btnEditP').click(e=>{
e.preventDefault()
let id =$(e.target).data('id');
let oldPass = $('#oldPass').val()
let newPass = $('#newPass').val()
if(oldPass==='' || newPass===''){
  $('#errorEP').removeAttr('style')
  $('#errorEP').text("")
  $('#errorEP').text("Vui lòng nhập đầy đủ thông tin.")
}else if(oldPass===newPass){
  $('#errorEP').removeAttr('style')
  $('#errorEP').text("")
  $('#errorEP').text("Mật khẩu mới phải khác mật khẩu cũ")
}else{
  let data = {
    id:id,
    oldPassword:oldPass,
    newPassword:newPass
  }
  fetch('http://localhost:8080/khoa/EditPassword',{
    method:'POST',
    body:JSON.stringify(data)
  })
  .then(res=>res.json())
  .then(json=>{
    if(json.code ===0){
      $('#errorEP').removeAttr('style')
      $('#errorEP').text("")
      $('#errorEP').text(json.message)
    }else{
      $('#errorEP').removeAttr('style')
      $('#errorEP').text("")
      $('#errorEP').text(json.message)
      setTimeout(()=>{
        $('#confirm-editPass-dialog').modal('hide')
      },2000)
    }
  })
  .catch(e=>console.log(e))
}
})

var loadFile = function(event) {
	var image = document.getElementById('output');
	image.src = URL.createObjectURL(event.target.files[0]);
  console.log(image.src)
};


CKEDITOR.replace('txtContentStu')