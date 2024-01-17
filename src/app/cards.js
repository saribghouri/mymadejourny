"use client";

import Card from "antd/es/card/Card";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
const Cards = () => {
    const [activeDoctors, setActiveDoctors] = useState(false);
    const [activePharmacy, setActivePharmacy] = useState(false);
    const [pharmacyCount, setPharmacyCount] = useState(false);
    const [inActiveDoctors, setInActiveDoctors] = useState(false);
    const [inActivePharmacy, setInActivePharmacy] = useState(false);
    const [loading, setLoading] = useState(false);
    console.log(pharmacyCount)
    const [doctorsCount, setDoctorsCount] = useState(0);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = Cookies.get("apiToken");
        const response = await fetch(
          "https://mymedjournal.blownclouds.com/api/fatch/doctor",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          console.log("Doctors fetched successfully:", data);
          const activeDoctors = data.doctor.filter(
            (doctor) => doctor.isActives == 1
          );
          const inActiveDoctors = data.doctor.filter(
            (doctor) => doctor.isActives == 0
          );

          console.log("Active doctors:", activeDoctors);
          setDoctorsCount(data.doctor.length);
          setActiveDoctors(activeDoctors.length);
          setInActiveDoctors(inActiveDoctors.length);
        } else {
          console.error("Failed to fetch doctors");
        }
      } catch (error) {
        console.error("Error fetching doctors:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

 
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = Cookies.get("apiToken");
        const response = await fetch(
          "https://mymedjournal.blownclouds.com/api/fatch/all/Pharmacies",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          console.log("Pharmacy fetched successfully:", data);
          const activePharmacy = data.all_pharmacies.filter(
            (Pharmacy) => Pharmacy.isActives == 1
          );
          const inActivePharmacy = data.all_pharmacies.filter(
            (Pharmacy) => Pharmacy.isActives == 0
          );

          console.log("Active doctors:", activeDoctors);
          setPharmacyCount(data.all_pharmacies.length);
          setActivePharmacy(activePharmacy.length);
          setInActivePharmacy(inActivePharmacy.length);
        } else {
          console.error("Failed to fetch doctors");
        }
      } catch (error) {
        console.error("Error fetching doctors:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <div>
        <div className="flex flex-wrap gap-4 w-[98%] ml-[10px] mt-10">
          <Card
            className="bg-[#e1edff] card"
            style={{ width: "calc(32.2% - 10px)" }}
          >
            <p className="text-[#2361dd] pgh font-bold text-22">
              Total Doctors
            </p>
            <p className="text-[#2361dd]  flex justify-end mr-10 font-bold text-30">
              {doctorsCount}
            </p>
          </Card>

          <Card
            className="bg-[#e1edff] card"
            style={{ width: "calc(32.33% - 10px)" }}
          >
            <p className="text-[#24ac18] pgh font-bold text-22">
              Active Doctors
            </p>
            <p className="text-[#24ac18] flex justify-end mr-10 font-bold text-30">
              {activeDoctors}
            </p>
          </Card>

          <Card
            className="bg-[#e1edff] card"
            style={{ width: "calc(32.33% - 10px)" }}
          >
            <p className="text-[#c01c1c] pgh font-bold text-22">
              InActive Doctors
            </p>
            <p className="text-[#c01c1c]  flex justify-end mr-10 font-bold text-30">
              {inActiveDoctors}
            </p>
          </Card>

          <Card
            className="bg-[#e1edff] card"
            style={{ width: "calc(32.33% - 10px)" }}
          >
            <p className="text-[#2361dd] pgh font-bold text-22">
              Total Pharmacies
            </p>
            <p className="text-[#2361dd]  flex justify-end mr-10 font-bold text-30">
              {pharmacyCount}
            </p>
          </Card>

          <Card
            className="bg-[#e1edff] card"
            style={{ width: "calc(32.33% - 10px)" }}
          >
            <p className="text-[#24ac18] pgh font-bold text-22">
              Active Pharmacies
            </p>
            <p className="text-[#24ac18]  flex justify-end mr-10 font-bold text-30">
              {activePharmacy}
            </p>
          </Card>

          <Card
            className="bg-[#e1edff] card"
            style={{ width: "calc(32.33% - 10px)" }}
          >
            <p className="text-[#c01c1c] pgh font-bold text-22">
              InActive Pharmacies
            </p>
            <p className="text-[#c01c1c] flex justify-end mr-10 font-bold text-30">
              {inActivePharmacy}
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Cards;
