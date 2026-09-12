"use client";

import { useState } from "react";

const departments = [
  "IQC",
  "OQC",
  "Assy Seat",
  "Assy Mirror",
];

type Implementation = {
  list: string;
  area: string;
};

type AnswerDetail = {
  nomor: number;
  jawabanPeserta: string;
  jawabanBenar: string;
  benar: boolean | string | number;
};

type ResultData = {
  benar: number;
  total: number;
  nilai: number;
  details: AnswerDetail[];
};

export default function Home() {
  // ==========================================
  // TANGGAL
  // ==========================================

  const today = new Date()
    .toISOString()
    .split("T")[0];


  // ==========================================
  // DATA PESERTA
  // ==========================================

  const [nama, setNama] = useState("");

  const [department, setDepartment] =
    useState("");

  const [tanggal, setTanggal] =
    useState(today);


  // ==========================================
  // JAWABAN 14Q
  // ==========================================

  const [q14Answers, setQ14Answers] =
    useState<string[]>(
      Array(14).fill("")
    );


  // ==========================================
  // IMPLEMENTASI
  // ==========================================

  const [implementations, setImplementations] =
    useState<Implementation[]>(
      Array.from(
        { length: 14 },
        () => ({
          list: "",
          area: "",
        })
      )
    );


  // ==========================================
  // STATUS
  // ==========================================

  const [submitted, setSubmitted] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");


  // ==========================================
  // HASIL
  // ==========================================

  const [result, setResult] =
    useState<ResultData | null>(null);


  // ==========================================
  // UPDATE JAWABAN
  // ==========================================

  const updateQ14 = (
    index: number,
    value: string
  ) => {
    const updated =
      [...q14Answers];

    updated[index] = value;

    setQ14Answers(updated);
  };


  // ==========================================
  // UPDATE IMPLEMENTASI
  // ==========================================

  const updateImplementation = (
    index: number,
    field: "list" | "area",
    value: string
  ) => {
    const updated =
      [...implementations];

    updated[index] = {
      ...updated[index],
      [field]: value,
    };

    setImplementations(updated);
  };


  // ==========================================
  // SUBMIT
  // ==========================================

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setError("");


    // ------------------------------------------
    // VALIDASI NAMA
    // ------------------------------------------

    if (!nama.trim()) {
      setError(
        "Nama wajib diisi."
      );

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

      return;
    }


    // ------------------------------------------
    // VALIDASI DEPARTMENT
    // ------------------------------------------

    if (!department) {
      setError(
        "Department wajib dipilih."
      );

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

      return;
    }


    // ------------------------------------------
    // LOADING
    // ------------------------------------------

    setLoading(true);


    try {

      // ----------------------------------------
      // KIRIM DATA KE API
      // ----------------------------------------

      const response =
        await fetch(
          "/api/submit",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              nama,
              department,
              tanggal,
              q14Answers,
              implementations,
            }),
          }
        );


      // ----------------------------------------
      // RESPONSE
      // ----------------------------------------

      const data =
        await response.json();


      console.log(
        "Response submit:",
        data
      );


      // ----------------------------------------
      // ERROR HTTP
      // ----------------------------------------

      if (!response.ok) {
        throw new Error(
          data.message ||
          "Gagal mengirim data."
        );
      }


      // ----------------------------------------
      // ERROR SERVER
      // ----------------------------------------

      if (!data.success) {
        throw new Error(
          data.message ||
          "Jawaban gagal disimpan."
        );
      }


      // ----------------------------------------
      // SIMPAN DETAILS
      // ----------------------------------------

      const details: AnswerDetail[] =
        Array.isArray(data.details)
          ? data.details.map(
              (item: any) => ({
                nomor:
                  Number(
                    item?.nomor
                  ),

                jawabanPeserta:
                  String(
                    item?.jawabanPeserta ??
                    ""
                  ),

                jawabanBenar:
                  String(
                    item?.jawabanBenar ??
                    ""
                  ),

                benar:
                  item?.benar,
              })
            )
          : [];


      console.log(
        "Details:",
        details
      );


      // ----------------------------------------
      // SIMPAN HASIL
      // ----------------------------------------

      setResult({

        benar:
          Number(
            data.benar ?? 0
          ),

        total:
          Number(
            data.total ?? 14
          ),

        nilai:
          Number(
            data.nilai ?? 0
          ),

        details,
      });


      // ----------------------------------------
      // SUBMITTED
      // ----------------------------------------

      setSubmitted(true);


      // ----------------------------------------
      // SCROLL KE ATAS
      // ----------------------------------------

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

    } catch (err) {

      console.error(
        "Submit error:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Jawaban gagal disimpan."
      );

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

    } finally {

      setLoading(false);

    }
  };


  // ==========================================
  // RESET
  // ==========================================

  const handleReset = () => {

    setNama("");

    setDepartment("");

    setTanggal(today);

    setQ14Answers(
      Array(14).fill("")
    );

    setImplementations(
      Array.from(
        { length: 14 },
        () => ({
          list: "",
          area: "",
        })
      )
    );

    setSubmitted(false);

    setLoading(false);

    setError("");

    setResult(null);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };


  // ==========================================
  // CARI DETAIL SOAL
  // ==========================================

  const getAnswerDetail = (
    nomor: number
  ): AnswerDetail | undefined => {

    if (
      !result ||
      !Array.isArray(
        result.details
      )
    ) {
      return undefined;
    }

    return result.details.find(
      (item) =>
        Number(item.nomor) === nomor
    );
  };


  // ==========================================
  // CEK BENAR / SALAH
  // ==========================================

  const isAnswerCorrect = (
    nomor: number
  ): boolean => {

    const detail =
      getAnswerDetail(nomor);

    if (!detail) {
      return false;
    }

    const value =
      detail.benar;


    // Boolean
    if (value === true) {
      return true;
    }

    if (value === false) {
      return false;
    }


    // Number
    if (value === 1) {
      return true;
    }

    if (value === 0) {
      return false;
    }


    // String
    const text =
      String(value)
        .trim()
        .toLowerCase();

    return (
      text === "true" ||
      text === "1" ||
      text === "benar" ||
      text === "yes" ||
      text === "ya"
    );
  };


  // ==========================================
  // CLASS NOMOR
  // ==========================================

  const getNumberClass = (
    nomor: number
  ) => {

    if (!submitted) {
      return "numberCell";
    }

    return isAnswerCorrect(nomor)
      ? "numberCell correctCell"
      : "numberCell wrongCell";
  };


  // ==========================================
  // CLASS JAWABAN
  // ==========================================

  const getAnswerClass = (
    nomor: number
  ) => {

    if (!submitted) {
      return "";
    }

    return isAnswerCorrect(nomor)
      ? "answerCellCorrect"
      : "answerCellWrong";
  };


  // ==========================================
  // RENDER
  // ==========================================

  return (
    <main className="page">

      <div className="container">


        {/*HEADER*/}

        <header className="header">

          <div className="brand">

            <div className="brandLogo">
              BUMJIN
            </div>

            <div className="brandText">

              <span>
                QUALITY
              </span>

              <strong>
                TRAINING
              </strong>

            </div>

          </div>


          <div className="headerLine" />


          <h1>
            14Q BASICS PRINCIPLE
          </h1>


          <p>
            PRE TEST
          </p>

        </header>


        {/*HASIL*/}

        {submitted &&
          result && (

            <div className="resultBox">

              <div className="resultTop">

                <div className="resultIcon">
                  ✓
                </div>

                <div>

                  <h2>
                    Test Selesai
                  </h2>

                  <p>
                    Terima kasih,{" "}
                    <strong>
                      {nama}
                    </strong>
                  </p>

                </div>

              </div>


              <div className="score">

                <div className="scoreItem">

                  <span>
                    Jawaban Benar
                  </span>

                  <strong>
                    {result.benar}
                    {" / "}
                    {result.total}
                  </strong>

                </div>


                <div className="scoreItem">

                  <span>
                    Nilai
                  </span>

                  <strong>
                    {result.nilai}
                  </strong>

                </div>

              </div>


              <div className="legend">

                <span className="legendCorrect">
                  ✓ Benar
                </span>

                <span className="legendWrong">
                  ✕ Salah
                </span>

              </div>

            </div>

          )}


        {/*ERROR*/}

        {error && (

          <div className="errorBox">

            <span>
              ⚠
            </span>

            <p>
              {error}
            </p>

          </div>

        )}


        {/*FORM*/}

        <form
          onSubmit={handleSubmit}
        >


          {/* ==================================
              DATA PESERTA
          =================================== */}

          <section className="card">

            <div className="sectionTitle">

              <div className="sectionNumber">
                A
              </div>

              <div>

                <h2>
                  DATA PESERTA
                </h2>

                <p>
                  Silakan isi data diri Anda
                </p>

              </div>

            </div>


            <div className="participantGrid">


              {/* NAMA */}

              <div className="formGroup">

                <label>
                  Nama
                  <span>*</span>
                </label>

                <input
                  type="text"
                  value={nama}
                  onChange={(e) =>
                    setNama(
                      e.target.value
                    )
                  }
                  placeholder="Masukkan nama lengkap"
                  disabled={submitted}
                />

              </div>


              {/* DEPARTMENT */}

              <div className="formGroup">

                <label>
                  Department
                  <span>*</span>
                </label>

                <select
                  value={department}
                  onChange={(e) =>
                    setDepartment(
                      e.target.value
                    )
                  }
                  disabled={submitted}
                >

                  <option value="">
                    Pilih Department
                  </option>

                  {departments.map(
                    (item) => (

                      <option
                        key={item}
                        value={item}
                      >
                        {item}
                      </option>

                    )
                  )}

                </select>

              </div>


              {/* TANGGAL */}

              <div className="formGroup">

                <label>
                  Tanggal
                </label>

                <input
                  type="date"
                  value={tanggal}
                  onChange={(e) =>
                    setTanggal(
                      e.target.value
                    )
                  }
                  disabled={submitted}
                />

              </div>

            </div>

          </section>


          {/* ==================================
              SOAL 1
          =================================== */}

          <section className="card">

            <div className="questionHeader">

              <div className="questionNumber">
                1
              </div>

              <div className="questionText">

                <h2>
                  Sebutkan total 14Q Basics
                  Principle menurut yang Anda
                  ketahui:
                </h2>

                <p>
                  Tuliskan nama dari masing-masing
                  14Q Basics Principle.
                </p>

              </div>

            </div>


            <div className="tableContainer">

              <table className="q14Table">

                <thead>

                  <tr>

                    <th>
                      No.
                    </th>

                    <th>
                      14Q Name
                    </th>

                    <th>
                      No.
                    </th>

                    <th>
                      14Q Name
                    </th>

                  </tr>

                </thead>


                <tbody>

                  {Array.from({
                    length: 7,
                  }).map(
                    (_, index) => {

                      const leftNomor =
                        index + 1;

                      const rightNomor =
                        index + 8;


                      const leftResult =
                        getAnswerDetail(
                          leftNomor
                        );

                      const rightResult =
                        getAnswerDetail(
                          rightNomor
                        );


                      const leftCorrect =
                        isAnswerCorrect(
                          leftNomor
                        );

                      const rightCorrect =
                        isAnswerCorrect(
                          rightNomor
                        );


                      return (

                        <tr
                          key={index}
                        >


                          {/* =========================
                              NOMOR KIRI
                          ========================== */}

                          <td
                            className={
                              getNumberClass(
                                leftNomor
                              )
                            }
                          >
                            {leftNomor}
                          </td>


                          {/* =========================
                              JAWABAN KIRI
                          ========================== */}

                          <td
                            className={
                              getAnswerClass(
                                leftNomor
                              )
                            }
                          >

                            <input
                              type="text"
                              value={
                                q14Answers[
                                  leftNomor - 1
                                ]
                              }
                              onChange={(e) =>
                                updateQ14(
                                  leftNomor - 1,
                                  e.target.value
                                )
                              }
                              placeholder="Tulis jawaban..."
                              disabled={submitted}
                            />


                            {submitted &&
                              leftResult && (

                                <div
                                  className={
                                    leftCorrect
                                      ? "answerResult answerResultCorrect"
                                      : "answerResult answerResultWrong"
                                  }
                                >

                                  {leftCorrect
                                    ? "✓ Benar"
                                    : "✕ Salah"}

                                </div>

                              )}

                          </td>


                          {/* =========================
                              NOMOR KANAN
                          ========================== */}

                          <td
                            className={
                              getNumberClass(
                                rightNomor
                              )
                            }
                          >
                            {rightNomor}
                          </td>


                          {/* =========================
                              JAWABAN KANAN
                          ========================== */}

                          <td
                            className={
                              getAnswerClass(
                                rightNomor
                              )
                            }
                          >

                            <input
                              type="text"
                              value={
                                q14Answers[
                                  rightNomor - 1
                                ]
                              }
                              onChange={(e) =>
                                updateQ14(
                                  rightNomor - 1,
                                  e.target.value
                                )
                              }
                              placeholder="Tulis jawaban..."
                              disabled={submitted}
                            />


                            {submitted &&
                              rightResult && (

                                <div
                                  className={
                                    rightCorrect
                                      ? "answerResult answerResultCorrect"
                                      : "answerResult answerResultWrong"
                                  }
                                >

                                  {rightCorrect
                                    ? "✓ Benar"
                                    : "✕ Salah"}

                                </div>

                              )}

                          </td>

                        </tr>

                      );

                    }
                  )}

                </tbody>

              </table>

            </div>

          </section>


          {/* ==================================
              SOAL 2
          =================================== */}

          <section className="card">

            <div className="questionHeader">

              <div className="questionNumber">
                2
              </div>

              <div className="questionText">

                <h2>
                  Sebutkan list 14Q yang sudah
                  implementasi di PT. Bumjin
                  menurut yang Anda ketahui,
                  sebutkan area kerjanya:
                </h2>

                <p>
                  Soal ini hanya sebagai catatan
                  dan tidak masuk perhitungan nilai.
                </p>

              </div>

            </div>


            <div className="tableContainer">

              <table className="implementationTable">

                <thead>

                  <tr>

                    <th>
                      No.
                    </th>

                    <th>
                      List Implementasi
                      14Q Basics
                    </th>

                    <th>
                      Area Kerja
                    </th>

                  </tr>

                </thead>


                <tbody>

                  {implementations.map(
                    (item, index) => (

                      <tr
                        key={index}
                      >

                        <td className="numberCell">
                          {index + 1}
                        </td>


                        <td>

                          <input
                            type="text"
                            value={
                              item.list
                            }
                            onChange={(e) =>
                              updateImplementation(
                                index,
                                "list",
                                e.target.value
                              )
                            }
                            placeholder="Tulis implementasi..."
                            disabled={submitted}
                          />

                        </td>


                        <td>

                          <input
                            type="text"
                            value={
                              item.area
                            }
                            onChange={(e) =>
                              updateImplementation(
                                index,
                                "area",
                                e.target.value
                              )
                            }
                            placeholder="Tulis area kerja..."
                            disabled={submitted}
                          />

                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            </div>

          </section>


          {/* ==================================
              BUTTON
          =================================== */}

          <div className="buttonArea">

            {!submitted ? (

              <button
                type="submit"
                className="submitButton"
                disabled={loading}
              >

                {loading ? (

                  <>
                    <span>
                      MENYIMPAN...
                    </span>

                    <span className="spinner" />
                  </>

                ) : (

                  <>
                    <span>
                      SUBMIT JAWABAN
                    </span>

                    <span className="arrow">
                      →
                    </span>
                  </>

                )}

              </button>

            ) : (

              <button
                type="button"
                className="resetButton"
                onClick={handleReset}
              >
                ISI TEST BARU
              </button>

            )}

          </div>

        </form>


        {/*FOOTER*/}

        <footer className="footer">

          <div className="footerLine" />

          <strong>
            SELAMAT MENGERJAKAN !!!
          </strong>

          <p>
            PT. BUMJIN ELECTRONICS INDONESIA
          </p>

        </footer>


      </div>

    </main>
  );
}