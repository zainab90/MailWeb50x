document.addEventListener('DOMContentLoaded', function() {

    // Use buttons to toggle between views
    document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
    document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
    document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
    document.querySelector('#compose').addEventListener('click', compose_email);

    // By default, load the inbox
    load_mailbox('inbox');
 document.querySelector('#compose-form').onsubmit= function(){

const recipients=document.querySelector('#compose-recipients').value;
const sender=document.querySelector('#sender').value;
const subj_email= document.querySelector('#compose-subject').value;
const email_body=document.querySelector('#compose-body').value;
fetch('/emails', {
    method: 'POST',
    body: JSON.stringify({
        recipients: recipients,
        subject: subj_email,
        body: email_body
    })
  })
  .then(response => response.json())
  .then(result => {
      // Print result
      console.log(result);
      if (result.message != null)
      {  console.log("correct");
      load_mailbox('sent')


      }
        if (result.error != null)
      {  console.log("incorrect");}
  });








return false;
    }
  });

  function compose_email(item) {
    // Show compose view and hide other views
    console.log(event.target.id);
    document.querySelector('#emails-view').style.display = 'none';
    document.querySelector('#compose-view').style.display = 'block';
    document.querySelector('#email-container').style.display='none'

if (event.target.id != 'compose')
{
//replay button

 // Clear out composition fields
    document.querySelector('#compose-recipients').value = item.sender;
    document.querySelector('#sender').value = item.recipients;
    document.querySelector('#compose-subject').value = `Re: ${item.subject}`;
    document.querySelector('#compose-body').value = `On ${item.timestamp}  ${item.sender}  wrote:`;



}
else{
// new message
 // Clear out composition fields
    document.querySelector('#compose-recipients').value = '';
    document.querySelector('#compose-subject').value = '';
    document.querySelector('#compose-body').value = '';


}



  }

  function load_mailbox(mailbox) {

    // Show the mailbox and hide other views
    document.querySelector('#emails-view').style.display = 'block';
    document.querySelector('#compose-view').style.display = 'none';
    document.querySelector('#email-container').style.display='none'

    // Show the mailbox name
    document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;
fetch(`/emails/${mailbox}`)
.then(response => response.json())
.then(emails => {
    // Print emails
    console.log(emails);
    console.log(mailbox);
    if (mailbox=='sent')
    {emails.forEach((item) => {
     display_email(item,1)

    });






    }
    else
    {emails.forEach((item) => {
     display_email(item,0)

    });}




});


function display_email(item,box_type){
const element = document.createElement('div');
element.className='card my-1';
const chil= document.createElement('div');
chil.className='card-body d-flex justify-content-between';

const send_email=document.createElement('div');
send_email.innerHTML=`${item.sender} `;
chil.appendChild(send_email);

const subj_email=document.createElement('div');
subj_email.innerHTML=`${item.subject} `;
chil.appendChild(subj_email);


const time_email=document.createElement('div');
time_email.innerHTML=`${item.timestamp} `;
chil.appendChild(time_email);


//chil.innerHTML = `${item.sender} "    "  ${item.subject} "    "  ${item.timestamp} `;
element.appendChild(chil);
if (item.read){element.style.background='#f8f9fa'}
else{
element.style.background='white'
}

element.addEventListener('click', function(){viewEmail(item,box_type)});

document.querySelector('#emails-view').append(element);
}

function viewEmail(item,box_type){
  document.querySelector('#emails-view').style.display = 'none';
    document.querySelector('#compose-view').style.display = 'none';
    document.querySelector('#email-container').style.display='block';

    const em_sender= document.querySelector('#em-sender');
    const em_recipients= document.querySelector('#em-rec');
    const em_subject=document.querySelector('#em-sub');
    const em_time=document.querySelector('#em-time');
    const em_body= document.querySelector('#em-body');
    const archive_btn=document.querySelector('#arch_btn');
    const replay_btn= document.querySelector('#replay_btn');
fetch(`/emails/${item.id}`)
.then(response => response.json())
.then(email => {
em_sender.innerHTML=`<span class="text-muted">From: </span>${item.sender}`;
em_recipients.innerHTML=`<span class="text-muted">To: </span>${item.recipients}`;
em_subject.innerHTML=`<span class="text-muted">Subject: </span>${item.subject}`;
em_time.innerHTML=`<span class="text-muted">Timestamp: </span>${item.timestamp}`
em_body.innerHTML=item.body;
});

//change the read status
fetch(`/emails/${item.id}`, {
  method: 'PUT',
  body: JSON.stringify({
      read: true
  })
})


if (box_type===1){
archive_btn.style.display = 'none';
}

else{

archive_btn.style.display = 'inline';
// fetch value of archived flag if is true make innerhtml=unarchived and via verses
var arch_flag;

if (item.archived){
// if true
archive_btn.innerHTML='Unarchived'
}
else{
archive_btn.innerHTML='Archive'
}




    arch_btn.onclick=function(){
    //do the action of archive btn

    fetch(`/emails/${item.id}`, {
  method: 'PUT',
  body: JSON.stringify({
      archived: !item.archived
  })
})
.then(response => {ret_resp=response.status;

if (ret_resp==204){
load_mailbox('inbox')
}

else{
alert('error in PUT event');
}
})

.then(data => {

});



    };


}



replay_btn.onclick=function(){
compose_email(item)

}



}




  }