let socket 
      let onlineUser=[]
      let username
      window.onload=()=>{
        console.log("server  đã sẵn sàng hoạt dộng")
         socket= io()
        socket.on('connect',()=>{
          console.log("đã kết nối socket thành công id= ",socket.id)
          setTimeout(()=>{
            username = sessionStorage.getItem("username")
            if(username){
              console.log(" đã lấy tên người dùng từ session storgare");
            }
            if(!username){
            username= prompt(" nhập tên của bạn")
            sessionStorage.setItem("username", username)
          }
          // gửi tên đăng kí cho server
          socket.emit('regiter-nameUser', username)
          },500)// đợi ẩn thông báo xanh và đổ ở dưới góc màn hìnhrồi cho nhập username
         
        })
        // $("#online-notification").fadeTo(10,0)
        // $("#offline-notification").fadeTo(10,0)
        socket.on('disconnect',()=>console.log("đã mất kết nối đến server"))
        socket.on('error',()=>console.log("đã xảy ra lỗi: ",e.message))
        /*socket.on('message',(mess)=>{
          console.log("tin nhận được: ",mess)
          socket.send('tin nhăn trả lại từ client')
        })*/
        //Xu ly thong bao moi
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
              fetch('http://localhost:8080/khoa/upload',{method:'POST',body: JSON.stringify(data)})
              .then(res=>res.json())
              .then(json=>{
                  console.log(json)
                  socket.emit('notify',json.data)
                  $('#title').val('')
                  $('#chude').removeAttr('checked')
                  CKEDITOR.instances['txtContent'].setData('')
                  $('#confirm-post-dialog').modal('hide')
              })
              .catch(e=>console.log(e))
          }
        })
        // danh sách người đã vào web nhận từ server 
        socket.on("list-users",(m)=>{
          console.log(" đã nhận danh sách user online từ server",m)
          m.forEach(u=>{
            console.log(u)
            if(u.id!==socket.id){
              onlineUser.push(u)// thêm user vào danh sách người trừ chính mình ( socket là máy của mình )// hiển thị ra danh sách những người đã vào trang web trước đó ( nếu ko có thì người vào sau sẽ ko thấy người vào trước)
            }
          })
        })

        // sựu kiện đăng kí thêm một người dùng mới vào trang web 
        socket.on("new-user",m=>{
          console.log("new user connect", m )
          onlineUser.push(m)
        })
        
        // sự kiệ khi người dùng thoát ra web 
        socket.on('user-leave',id=>{
          let user = onlineUser.find(u=>u.id===id)
          onlineUser = onlineUser.filter(u=>u.id!=id)
          console.log(`user id ${id} đã thoát, chỉ còn ${onlineUser.length} user trong phòng`)
          remove(id)
          notifyOffline(user.username)
        })
        socket.on('alertNoti',s=>{
          let m = s.message
          console.log(m)
          notifyOnline(m)
        })
        // nhận thông tin user name từ server
        socket.on('register-name',data=>{
          let {id, username}= data
          let user= onlineUser.find(u=>u.id==id)
          if(!user){
            return console.log("khong tim thay user ")
          }
          user.username = username
          console.log(`client ${id} đã đăng kí với tên ${username}`)
          notifyOnline(username)
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
    console.log('ok')
    $('#confirm-post-dialog').modal('show')
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

// EDIT
$('.edit').click(e=>{
  let id = e.target.dataset.id
  $('#confirm-edit-dialog').modal('show')

})
