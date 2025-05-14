let studyGroups = [];
var currentPage = 1;
var itemsPerPage = 3;
var code="";


    document.getElementById('deleteByCid').addEventListener('click',async function(event) {
      event.preventDefault(); 
      if(code!="")
      {
        if (confirm("Are you sure you want to delete this item?")) 
        {
          var formData = {
            Ccode: code[0].Ccode 
          };
          const response = await fetch('https://5207761d-52f6-4f25-af61-f48982a42036-00-3s1z67zpflpu6.sisko.replit.dev/delete_study_group.php', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
          });
          var data = await response.json();

          if (response.ok) {
            alert(data.message);}

          window.location.reload();
        }
        else
           alert("Deletion canceled.");
      }
  });

    document.getElementById('editByCid').addEventListener('click', function(event) {
      event.preventDefault(); 
      // Set input field values
      document.getElementById('Cname').value =code[0].Gname;
      document.getElementById('Ccode').value = code[0].Ccode;
      document.getElementById('MeetingTime').value = code[0].MeetingTime; // Format: YYYY-MM-DDTHH:MM
      document.getElementById('Faculty').value = code[0].Faculty;
      document.getElementById('Gdesc').value =code[0].GDesc;

    });

    document.addEventListener('click', function (e) {
      const target = e.target.closest('a[href="#detail-view"]');
      if (target) {
        e.preventDefault();
        const value = target.getAttribute('data-value');
        fetchStudyGroupsByCid(value);
      }
    });

    async function fetchStudyGroupsByCid(cid)
    {
      document.getElementById("editByCid").style.visibility = "hidden";
      document.getElementById("deleteByCid").style.visibility = "hidden";
      var formData = {
        Ccode: cid  
      };
      const response = await fetch('https://5207761d-52f6-4f25-af61-f48982a42036-00-3s1z67zpflpu6.sisko.replit.dev/get_study_group_cid.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      var data = await response.json();
      //alert();
      code=data;
      const groupDetailsHTML = `     
        <h2>Group: `+data[0].Gname+`</h2>
        <p><strong>Course:</strong>`+data[0].Ccode+`</p>
        <p><strong>Meeting Time:</strong>`+data[0].MeetingTime+`</p>
        <p><strong>Description:</strong> `+data[0].GDesc+`</p>`;
      code=data;
      document.getElementById('dvData').innerHTML = groupDetailsHTML;
      const container = document.getElementById('dvData');
      container.setAttribute('tabindex', '-1');
      document.getElementById("editByCid").style.visibility = "visible";
      document.getElementById("deleteByCid").style.visibility = "visible";
      // Ensure scrolling works
      setTimeout(() => {
        container.scrollIntoView({ behavior: 'smooth', block: 'start' });
        container.focus();
      }, 100);
    }

    async function searchData(){
       var txtdata=document.getElementById('searchByText').value;
      if(txtdata===""){
        txtdata="null";
      }
      var formData = {
        text: txtdata,
        Faculty: document.getElementById('filterByFaculty').value,

        sortby: document.getElementById('sortedBy').value
      };

      const response = await fetch('https://5207761d-52f6-4f25-af61-f48982a42036-00-3s1z67zpflpu6.sisko.replit.dev/get_study_group_filter.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      studyGroups = await response.json();
      renderPage();
    } document.getElementById('filterByFaculty').addEventListener('change', async function(event) {
      event.preventDefault(); 
      searchData();      
    });

    document.getElementById('searchByText').addEventListener('input', async function(event) {
      event.preventDefault(); 
      searchData();      

    });

    document.getElementById('sortedBy').addEventListener('change', async function(event) {
      event.preventDefault(); 
      searchData();      
    });

    document.getElementById('studyGroupForm').addEventListener('submit', async function(event) {
      event.preventDefault();

      const formData = {
        Cname: document.getElementById('Cname').value,
        Ccode: document.getElementById('Ccode').value,
        MeetingTime: document.getElementById('MeetingTime').value,
        Faculty: document.getElementById('Faculty').value,
        Gdesc: document.getElementById('Gdesc').value
      };
      const response = await fetch('https://5207761d-52f6-4f25-af61-f48982a42036-00-3s1z67zpflpu6.sisko.replit.dev/insert_study_group.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (response.ok) {
        alert(result.message);
        document.getElementById('studyGroupForm').reset();
        window.location.reload();
      }
    });

    async function fetchStudyGroups() {
      try {
         const response = await fetch('https://5207761d-52f6-4f25-af61-f48982a42036-00-3s1z67zpflpu6.sisko.replit.dev/get_study_group.php');
        studyGroups = await response.json();
        
        renderPage();

        const response1 = await fetch('https://5207761d-52f6-4f25-af61-f48982a42036-00-3s1z67zpflpu6.sisko.replit.dev/get_comment.php');
        const data1 = await response1.json();
        const container1 = document.getElementById('cmnts');
        container1.innerHTML = '';
        data1.forEach(comments => {
        const p = document.createElement('p');

        p.innerHTML = `
          <strong>${comments.Sname}:</strong></br>
          ${comments.Gname} : ${comments.Comment} <br><br>`;
          container1.appendChild(p);
        });
          
          studyGroups.forEach(group => {
          const option = document.createElement('option');
          option.value = group.Gname;
          option.textContent = group.Gname;
          document.getElementById('SGroups').appendChild(option);
        });
      } catch (error) {
        console.error('Error fetching study groups:', error);
        document.getElementById('groupContainer').innerHTML = `<p style="color:red;">Failed to load data.</p>`;
      }
    }

    function renderPage() {

      let container = document.getElementById('groupContainer');
      container.innerHTML = '';

        let startIndex = (currentPage - 1) * itemsPerPage;
        let endIndex = startIndex + itemsPerPage;

        let pageItems = studyGroups.slice(startIndex, endIndex);

      pageItems.forEach(group => {
          let article = document.createElement('article');
        article.className = 'review-card';
        article.innerHTML = `
          <h3>${group.Gname}</h3>
          <p><strong>Course:</strong> ${group.Ccode}</p>
          <p><strong>Meeting Time:</strong>    ${group.MeetingTime}</p> <a href="#detail-view" class="link" data-value="${group.Ccode}">Read more</a>
          `;
        container.appendChild(article);
      });

      document.getElementById('pageInfo').textContent = `Page ${currentPage} of ${Math.ceil(studyGroups.length / itemsPerPage)}`;

      // Enable/disable buttons
      document.getElementById('prevBtn').disabled = currentPage === 1;
      document.getElementById('nextBtn').disabled = endIndex >= studyGroups.length;

    }

    // Pagination buttons
    document.getElementById('prevBtn').addEventListener('click', () => {
      if (currentPage > 1) {
        currentPage--;
        renderPage();
      }
    });

    document.getElementById('nextBtn').addEventListener('click', () => {
      if (currentPage * itemsPerPage < studyGroups.length) {
        currentPage++;
        renderPage();
      }
    });

document.getElementById('post').addEventListener('click', async function(event){
  event.preventDefault();
    
  const cmtData = {
    Sname: document.getElementById('Sname').value,
    Gname: document.getElementById('SGroups').value,
    Comment: document.getElementById('Comment').value,   
  };
  const response = await fetch('https://5207761d-52f6-4f25-af61-f48982a42036-00-3s1z67zpflpu6.sisko.replit.dev/insert_comment.php', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(cmtData)
  });

  const result = await response.json();

  if (response.ok) {
    alert(result.message);
    window.location.reload();
  }
});

window.onload = fetchStudyGroups;
