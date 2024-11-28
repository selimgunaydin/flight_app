"use client";

import React, { useState, useEffect } from "react";
import { Users } from "@/src/types";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";

function RentView({ users }: Readonly<{ users: Users }>) {
  const totalSeats = 76;
  const [seats, setSeats] = useState<
    { id: number; occupied: boolean; selected: boolean; userName?: string }[]
  >([]);
  const [selectedSeats, setSelectedSeats] = useState<Array<string>>([]);
  const [openForms, setOpenForms] = useState<{ [key: string]: boolean }>({});
  const [lastInteraction, setLastInteraction] = useState<Date | null>(null);
  const [showWarning, setShowWarning] = useState(false);
  const seatData = JSON.parse(localStorage.getItem("seatData") || "[]");

  useEffect(() => {
    const occupiedSeats = Array.from({ length: totalSeats }, (_, index) => ({
      id: index + 1,
      occupied: index < users.length,
      selected: false,
      userName: index < users.length ? users[index].name : undefined,
    }));

    setSeats(occupiedSeats);

    const savedSelections = JSON.parse(
      localStorage.getItem("selectedSeats") || "[]"
    );
    setSelectedSeats(savedSelections);
  }, [users]);

  useEffect(() => {
    if (selectedSeats.length > 0 && lastInteraction) {
      const interval = setInterval(() => {
        if (new Date().getTime() - lastInteraction.getTime() > 30000) {
          setShowWarning(true);
        }
      }, 1000);
      return () => clearInterval(interval);
    }

    if (selectedSeats.length === 0 && lastInteraction) {
      localStorage.removeItem("seatData");
      localStorage.removeItem("selectedSeats");
    }
  }, [selectedSeats, lastInteraction]);

  const handleSeatClick = (id: number, rowLetter: string) => {
    setSeats((prevSeats) => {
      const selectedCount = prevSeats.filter((seat) => seat.selected).length;
      return prevSeats.map((seat) => {
        if (seat.id === id && !seat.occupied) {
          if (seat.selected) {
            return { ...seat, selected: false };
          }
          if (selectedCount < 3) {
            return { ...seat, selected: true };
          }
        }
        return seat;
      });
    });

    const seatIdentifier = `${rowLetter}${id}`;
    setSelectedSeats((prevSelectedSeats) => {
      const newSelection = prevSelectedSeats.includes(seatIdentifier)
        ? prevSelectedSeats.filter((seat) => seat !== seatIdentifier)
        : [...prevSelectedSeats, seatIdentifier];

      localStorage.setItem("selectedSeats", JSON.stringify(newSelection));
      return newSelection;
    });

    setOpenForms((prevForms) => ({
      ...prevForms,
      [id]: !prevForms[id],
    }));

    setLastInteraction(new Date());
  };

  const handleFormSubmit = (e: React.FormEvent, seat: string) => {
    e.preventDefault();

    const form = e.target as any;
    const inputs = form.querySelectorAll("input, select");
    let isValid = true;

    inputs.forEach((input: HTMLFormElement) => {
      if (!input.value) {
        isValid = false;
      }
    });

    if (isValid) {
      const storedData = localStorage.getItem("seatData");
      const seatData = storedData ? JSON.parse(storedData) : [];

      const newSeat = {
        seat: seat,
        name: inputs[0].value,
        surname: inputs[1].value,
        phone: inputs[2].value,
        email: inputs[3].value,
        gender: inputs[4].value,
        birthdate: inputs[5].value,
        address: inputs[6].value,
      };

      const seatIndex = seatData.findIndex(
        (seat: { email: string }) => seat.email === newSeat.email
      );
      if (seatIndex !== -1) {
        seatData[seatIndex] = newSeat;
      } else {
        seatData.push(newSeat);
      }

      localStorage.setItem("seatData", JSON.stringify(seatData));

      alert("Koltuk bilgileri başarıyla kaydedildi!");

      setOpenForms((prevForms) => ({
        ...prevForms,
        [form.id]: false,
      }));
    }
  };

  const handleRemoveSeat = (seatIdentifier: string) => {
    setSelectedSeats((prevSelectedSeats) => {
      const updatedSeats = prevSelectedSeats.filter(
        (seat) => seat !== seatIdentifier
      );

      localStorage.setItem("selectedSeats", JSON.stringify(updatedSeats));
      return updatedSeats;
    });

    setSeats((prevSeats) =>
      prevSeats.map((seat) => {
        if (
          `${String.fromCharCode(97 + Math.floor((seat.id - 1) / 4))}${
            seat.id
          }` === seatIdentifier
        ) {
          return { ...seat, selected: false };
        }
        return seat;
      })
    );
  };

  const handleWarningResponse = (response: boolean) => {
    if (response) {
      setShowWarning(false);
      setLastInteraction(new Date());
    } else {
      localStorage.removeItem("selectedSeats");
      localStorage.removeItem("seatData");
      window.location.reload();
    }
  };

  const handleComplate = () => {
    alert("İşlem tamamlandı.");
    localStorage.removeItem("selectedSeats");
    localStorage.removeItem("seatData");
    window.location.reload();
  };

  const isAllSeatsSaved =
    seatData.length > 0 && seatData.length === selectedSeats.length;

  return (
    <div className="grid grid-cols-12 gap-12 md:gap-0">
      <div className="col-span-12 md:col-span-6">
        <div className="bg-white inline-flex flex-col rounded-lg">
          <div className="grid grid-cols-12 gap-2 p-4 rounded-lg">
            {seats.map((seat, index) => {
              const rowLetter = String.fromCharCode(
                97 + Math.floor(index / 4)
              ).toUpperCase();
              return (
                <div
                  key={index}
                  className={twMerge(
                    clsx("col-span-3 h-6"),
                    index === 12 && "mb-4"
                  )}
                >
                  <div className="relative group">
                    <button
                      className={`w-6 h-6 border rounded-md flex items-center justify-center cursor-pointer text-sm ${
                        seat.occupied
                          ? "bg-gray-300 cursor-not-allowed"
                          : selectedSeats.includes(`${rowLetter}${seat.id}`)
                          ? "bg-blue-200 text-white"
                          : "bg-white"
                      }`}
                      disabled={
                        seat.occupied ||
                        (selectedSeats.length === 3 &&
                          !selectedSeats.includes(`${rowLetter}${seat.id}`))
                      }
                      onClick={() => {
                        if (seat.occupied) {
                          alert("Bu koltuk doludur.");
                        } else {
                          handleSeatClick(seat.id, rowLetter);
                        }
                      }}
                      title={seat.occupied ? "Occupied" : "Available"}
                    >
                      {seat.id}
                    </button>
                    {seat.occupied && seat.userName && (
                      <div className="absolute z-20 truncate px-2 py-1 bg-gray-400 text-white text-sm rounded opacity-0 group-hover:opacity-100 pointer-events-none">
                        {seat.userName}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="p-2 inline-flex gap-4 w-full justify-between px-4">
            <div className="flex flex-col items-center gap-1">
              <div className="w-5 h-8 bg-blue-200 rounded"></div>
              <p className="text-sm">Seçili</p>
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="w-5 h-8 bg-gray-300 rounded"></div>
              <p className="text-sm">Dolu</p>
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="w-5 h-8 bg-white border rounded"></div>
              <p className="text-sm">Boş</p>
            </div>
          </div>
        </div>
      </div>

      <div className="col-span-8 md:col-span-6 flex justify-center">
        <div className="bg-white px-8 py-6 shadow-lg mb-16 rounded-lg w-full">
          <h2 className="text-lg font-bold mb-4">Uçuş Bilgileri</h2>
          {selectedSeats.length > 0 ? (
            <div>
              {selectedSeats.map((seat) => (
                <div key={seat} className="mb-4">
                  <h3
                    className="text-sm font-semibold mb-2 cursor-pointer flex justify-between items-center border-b pb-4"
                    onClick={() =>
                      setOpenForms((prevForms) => ({
                        ...prevForms,
                        [seat]: !prevForms[seat],
                      }))
                    }
                  >
                    <div>
                      Koltuk No: {seat}{" "}
                      <span className="text-sm text-gray-400">
                        {seatData?.find(
                          (data: { seat: string }) => data.seat === seat
                        )
                          ? " - Bilgiler Kaydedildi"
                          : " - Lütfen Bilgilerinizi Giriniz"}
                      </span>
                    </div>
                    <div className="flex gap-4 items-center">
                      <span className="text-blue-500">
                        {openForms[seat] ? "Küçült" : "Genişlet"}
                      </span>
                      <p
                        className="text-red-500 text-lg"
                        onClick={() => handleRemoveSeat(seat)}
                      >
                        X
                      </p>
                    </div>
                  </h3>
                  {openForms[seat] && (
                    <form
                      className="space-y-2"
                      onSubmit={(e) => handleFormSubmit(e, seat)}
                    >
                      <div className="flex flex-col md:flex-row gap-2 md:gap-4">
                        <input
                          type="text"
                          placeholder="İsim *"
                          className="w-full p-2 border rounded text-sm"
                          value={
                            seatData?.find(
                              (data: { seat: string }) => data.seat === seat
                            )?.name
                          }
                          disabled={seatData?.find(
                            (data: { seat: string }) => data.seat === seat
                          )}
                        />
                        <input
                          type="text"
                          placeholder="Soy İsim *"
                          className="w-full p-2 border rounded text-sm"
                          value={
                            seatData?.find(
                              (data: { seat: string }) => data.seat === seat
                            )?.surname
                          }
                          disabled={seatData?.find(
                            (data: { seat: string }) => data.seat === seat
                          )}
                        />
                      </div>
                      <div className="flex flex-col md:flex-row  gap-2 md:gap-4">
                        <input
                          type="tel"
                          placeholder="Telefon *"
                          className="w-full p-2 border rounded text-sm"
                          disabled={seatData?.find(
                            (data: { seat: string }) => data.seat === seat
                          )}
                          value={
                            seatData?.find(
                              (data: { seat: string }) => data.seat === seat
                            )?.phone
                          }
                        />
                        <input
                          type="email"
                          placeholder="E-Posta *"
                          className="w-full p-2 border rounded text-sm"
                          value={
                            seatData?.find(
                              (data: { seat: string }) => data.seat === seat
                            )?.email
                          }
                          disabled={seatData?.find(
                            (data: { seat: string }) => data.seat === seat
                          )}
                        />
                      </div>
                      <div className="flex flex-col md:flex-row gap-2  gap-4">
                        <select
                          className="w-full p-2 border rounded text-sm"
                          value={
                            seatData?.find(
                              (data: { seat: string }) => data.seat === seat
                            )?.gender
                          }
                          disabled={seatData?.find(
                            (data: { seat: string }) => data.seat === seat
                          )}
                        >
                          <option value="">Cinsiyet *</option>
                          <option value="male">Erkek</option>
                          <option value="female">Kadın</option>
                        </select>
                        <input
                          type="date"
                          className="w-full p-2 border rounded text-sm"
                          max={new Date().toISOString().split("T")[0]}
                          value={
                            seatData?.find(
                              (data: { seat: string }) => data.seat === seat
                            )?.birthdate
                          }
                          disabled={seatData?.find(
                            (data: { seat: string }) => data.seat === seat
                          )}
                        />
                      </div>
                      <div className="flex gap-4">
                        <input
                          type="text"
                          placeholder="Adres *"
                          className="w-full p-2 border rounded text-sm"
                          value={
                            seatData?.find(
                              (data: { seat: string }) => data.seat === seat
                            )?.address
                          }
                          disabled={seatData?.find(
                            (data: { seat: string }) => data.seat === seat
                          )}
                        />
                      </div>
                      <button
                        type="submit"
                        className={twMerge(
                          clsx(
                            "mt-4 py-2 px-4 bg-blue-500 text-white rounded w-full",
                            seatData?.find(
                              (data: { seat: string }) => data.seat === seat
                            ) && "bg-gray-300"
                          )
                        )}
                        disabled={seatData?.find(
                          (data: { seat: string }) => data.seat === seat
                        )}
                      >
                        {seatData?.find(
                          (data: { seat: string }) => data.seat === seat
                        )
                          ? "Bilgiler Kaydedildi"
                          : "Bilgileri Kaydet"}
                      </button>
                    </form>
                  )}
                </div>
              ))}

              <div>
                <div className="mt-4 flex justify-between mb-4">
                  <div className="flex gap-1.5">
                    {selectedSeats.map((seat, index) => {
                      return (
                        <div
                          key={index}
                          className="bg-blue-200 h-12 w-8 flex items-center justify-center rounded-lg text-white"
                        >
                          {seat}
                        </div>
                      );
                    })}
                  </div>
                  <div className="flex flex-col items-end justify-between">
                    {selectedSeats.length > 0 && (
                      <div className="flex items-center gap-1.5">
                        <p className="text-sm">{selectedSeats.length}x</p>
                        <div className="w-4 h-5 bg-blue-200"></div>
                      </div>
                    )}
                    {selectedSeats.length > 0 && (
                      <div>
                        <p className="text-sm font-semibold">
                          Toplam: {selectedSeats.length * 1000} TL
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex w-full">
                  <button
                    className={twMerge(
                      clsx(
                        "bg-blue-500 text-white py-2 px-6 rounded-md w-full",
                        !isAllSeatsSaved && "bg-gray-400"
                      )
                    )}
                    onClick={handleComplate}
                    disabled={!isAllSeatsSaved}
                  >
                    {!isAllSeatsSaved ? (
                      <span className="2">
                        Lütfen koltuk bilgilerini doldurun.
                      </span>
                    ) : (
                      <span>İşlemi Tamamla</span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-center">Lütfen koltuk seçiniz.</p>
          )}
        </div>
      </div>

      {showWarning && (
        <div className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
          <div className="bg-white p-8 rounded-md shadow-lg">
            <h2 className="text-lg font-semibold mb-4">
              Uzun süre işlem yapılmadı. Devam etmek ister misiniz?
            </h2>
            <div className="flex gap-4 justify-center">
              <button
                className="py-2 px-4 bg-blue-500 text-white rounded-md"
                onClick={() => handleWarningResponse(true)}
              >
                Evet
              </button>
              <button
                className="py-2 px-4 bg-red-500 text-white rounded-md"
                onClick={() => handleWarningResponse(false)}
              >
                Hayır
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default RentView;
