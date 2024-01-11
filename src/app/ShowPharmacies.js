import React, { useState, useEffect } from 'react';
import Cookies from "js-cookie";
const ShowPharmacies = () => {
  const [userData, setUserData] = useState(null);
console.log(userData)
  // useEffect(() => {
  //   const fetchUserData = async () => {
  //     try {
  //       const response = await fetch('https://mymedjournal.blownclouds.com/api/user/details');
        
  //       if (!response.ok) {
  //         throw new Error('Network response was not ok');
  //       }

  //       const data = await response.json();
  //       setUserData(data);
  //     } catch (error) {
  //       console.error('Error fetching user data:', error.message);
  //     }
  //   };

  //   fetchUserData();
  // }, []);
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const token = Cookies.get("apiToken");
        const response = await fetch(
          "https://mymedjournal.blownclouds.com/api/user/details",
          {
            method: "GET",
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          setUserData(data.user_details[0]);
          setForceRerender((prev) => !prev);
        } else {
          console.error(
            "Failed to fetch user details:",
            response.status,
            response.statusText
          );
        }
      } catch (error) {
        console.error("Error during fetching user details:", error.message);
      }
    };

    fetchUserDetails();
  }, []);
  return (
    <div>
      {userData && (
        <div>
          <h1>userName:{userData.userName}</h1>
          <p>emailAddress: {userData.emailAddress}</p>
          <p>affiliationNo: {userData.affiliationNo}</p>
          <p>age: {userData.age}</p>
          
          {/* Add more details as needed */}

          {userData.profileImage && (
            <img src={userData.profileImage} alt="Profile" style={{ maxWidth: '100px', maxHeight: '100px' }} />
          )}
        </div>
      )}
    </div>
  );
};

export default ShowPharmacies;











