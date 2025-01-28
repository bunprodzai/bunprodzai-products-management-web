// Permissions 

const tablePermissions = document.querySelector("[table-permissions]");
if (tablePermissions) {
  const buttonSubmit = document.querySelector("[button-submit]");

  buttonSubmit.addEventListener("click", () => {
    let permissions = [];
    
    // Lặp qua từng hàng
    const rows = tablePermissions.querySelectorAll("[data-name]");

    rows.forEach((row) => {
      const dataName = row.getAttribute("data-name"); // Lấy ra data Name của hàng đó
      const inputs = row.querySelectorAll("input"); // Lấy ra tất cả ô inputs trong 1 hàng

      if (dataName === "id") {
        inputs.forEach(input => {
          const id = input.value;

          permissions.push({
            id: id,
            permissions: []
          });
        });
      } else {
        inputs.forEach((input, index) => {
          const checked = input.checked;
          if (checked) {
            permissions[index].permissions.push(dataName);
          }
        })
      }
    });

    const path = `/admin/roles/permissions`;
    const options = {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ permissions })
    }

    fetch(path, options)
      .then(res => res.json())
      .then(data => {
        if (data.code === 200) {
          alert("Cập nhập thành công");
          window.location.reload();
        }
      });
  });
}

// End Permissions 


// Permissions Data Default 

const dataRecords = document.querySelector("[data-records]");
if (dataRecords) {
  const records = JSON.parse(dataRecords.getAttribute("data-records"));
  
  const tablePermissions = document.querySelector("[table-permissions]");

  records.forEach((record, index) => {
    const permissions = record.permissions;
    
    permissions.forEach(permission => {
      const row = tablePermissions.querySelector(`[data-name="${permission}"]`); // Tìm các hàng có data-name
      const input = row.querySelectorAll("input")[index];
      input.checked=true;
    });

  });
}


// End Permissions Data Default