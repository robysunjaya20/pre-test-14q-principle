"use client";

import { useState } from "react";

import Soal, {
  Implementation,
  AnswerDetail,
} from "./soal";

import { KUNCI_JAWABAN } from "./kuncijawaban";


// ==========================================================
// DEPARTMENT
// ==========================================================

const departments = [
  "IQC",
  "OQC",
  "Assy Seat",
  "Assy Mirror",
];


// ==========================================================
// RESULT
// ==========================================================

type ResultData = {
  benar: number;
  total: number;
  nilai: number;
  details: AnswerDetail[];
};


// ==========================================================
// HOME
// ==========================================================

export default function Home() {

  // ========================================================
  // TANGGAL HARI INI
  // ========================================================

  const today =
    new Date()
      .toISOString()
      .split("T")[0];


  // ========================================================
  // DATA PESERTA
  // ========================================================

  const [nama, setNama] =
    useState("");

  const [department, setDepartment] =
    useState("");

  const [tanggal, setTanggal] =
    useState(today);


  // ========================================================
  // JAWABAN 14Q
  // ========================================================

  const [q14Answers, setQ14Answers] =
    useState<string[]>(
      Array(14).fill("")
    );


  // ========================================================
  // IMPLEMENTASI 14Q
  // ========================================================

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


  // ========================================================
  // STATUS
  // ========================================================

  const [submitted, setSubmitted] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [saveStatus, setSaveStatus] =
    useState("");


  // ========================================================
  // HASIL
  // ========================================================

  const [result, setResult] =
    useState<ResultData | null>(null);


  // ========================================================
  // NORMALIZE JAWABAN
  // ========================================================

  const normalizeAnswer = (
    value: string
  ) => {

    return String(value || "")
      .trim()
      .toLowerCase()
      .replace(/\s+/g, " ");

  };


  // ========================================================
  // CEK JAWABAN
  // ========================================================

  const checkAnswer = (
    answer: string,
    nomor: number
  ) => {

    const peserta =
      normalizeAnswer(answer);


    // Jawaban kosong = salah

    if (!peserta) {
      return false;
    }


    // Ambil kunci berdasarkan nomor

    const kunci =
      KUNCI_JAWABAN[
        nomor - 1
      ];


    if (!kunci) {
      return false;
    }


    // Cek seluruh alternatif jawaban

    return kunci.some(
      (item) =>
        normalizeAnswer(item) ===
        peserta
    );

  };


  // ========================================================
  // UPDATE JAWABAN 14Q
  // ========================================================

  const updateQ14 = (
    index: number,
    value: string
  ) => {

    const updated =
      [...q14Answers];

    updated[index] = value;

    setQ14Answers(updated);

  };


  // ========================================================
  // UPDATE IMPLEMENTASI
  // ========================================================

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


    setImplementations(
      updated
    );

  };


  // ========================================================
  // SUBMIT
  // ========================================================

  const handleSubmit = (
    e: React.FormEvent<HTMLFormElement>
  ) => {

    e.preventDefault();


    // ------------------------------------------------------
    // RESET ERROR / STATUS
    // ------------------------------------------------------

    setError("");

    setSaveStatus("");


    // ------------------------------------------------------
    // VALIDASI NAMA
    // ------------------------------------------------------

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


    // ------------------------------------------------------
    // VALIDASI DEPARTMENT
    // ------------------------------------------------------

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


    // ======================================================
    // HITUNG HASIL LANGSUNG DI FRONTEND
    // ======================================================

    const details: AnswerDetail[] =
      q14Answers.map(
        (answer, index) => {

          const nomor =
            index + 1;


          const benar =
            checkAnswer(
              answer,
              nomor
            );


          return {

            nomor,

            jawabanPeserta:
              answer,

            // Ini hanya digunakan
            // secara internal untuk
            // menentukan hasil.
            //
            // Tidak ditampilkan
            // kepada peserta.

            jawabanBenar:
              KUNCI_JAWABAN[
                index
              ].join(" / "),

            benar,

          };

        }
      );


    // ======================================================
    // JUMLAH BENAR
    // ======================================================

    const jumlahBenar =
      details.filter(
        (item) =>
          item.benar
      ).length;


    const total = 14;


    // ======================================================
    // NILAI
    // ======================================================

    const nilai =
      Math.round(
        (jumlahBenar / total) *
        100
      );


    // ======================================================
    // TAMPILKAN HASIL SEKARANG
    //
    // TIDAK MENUNGGU API
    // ======================================================

    setResult({

      benar:
        jumlahBenar,

      total:
        total,

      nilai:
        nilai,

      details:
        details,

    });


    // ======================================================
    // SUBMITTED LANGSUNG
    // ======================================================

    setSubmitted(true);


    // ======================================================
    // SCROLL KE HASIL
    // ======================================================

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });


    // ======================================================
    // SIMPAN KE GOOGLE SHEETS
    //
    // BERJALAN DI BACKGROUND
    // ======================================================

    setLoading(true);

    setSaveStatus(
      "Menyimpan jawaban ke sistem..."
    );


    // ======================================================
    // FETCH TANPA AWAIT
    //
    // Hasil peserta tidak menunggu proses ini.
    // ======================================================

    void fetch(
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

          // Hasil frontend
          // dikirim langsung
          // untuk disimpan.

          benar:
            jumlahBenar,

          total,

          nilai,

        }),

      }
    )
      .then(
        async (response) => {

          let data: any = null;


          try {

            data =
              await response.json();

          } catch {

            data = null;

          }


          if (
            !response.ok ||
            !data?.success
          ) {

            throw new Error(
              data?.message ||
              "Data gagal disimpan."
            );

          }


          console.log(
            "Data berhasil disimpan:",
            data
          );


          setSaveStatus(
            "✓ Jawaban berhasil disimpan."
          );

        }
      )
      .catch(
        (err) => {

          console.error(
            "Background save error:",
            err
          );


          setSaveStatus(
            "⚠ Hasil sudah ditampilkan, tetapi penyimpanan gagal."
          );


          setError(
            err instanceof Error
              ? err.message
              : "Gagal menyimpan jawaban."
          );

        }
      )
      .finally(
        () => {

          setLoading(false);

        }
      );

  };


  // ========================================================
  // RESET / TEST BARU
  // ========================================================

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

    setSaveStatus("");

    setResult(null);


    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

  };


  // ========================================================
  // CARI DETAIL JAWABAN
  // ========================================================

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
        Number(
          item.nomor
        ) === nomor
    );

  };


  // ========================================================
  // CEK BENAR / SALAH
  // ========================================================

  const isAnswerCorrect = (
    nomor: number
  ): boolean => {

    const detail =
      getAnswerDetail(
        nomor
      );


    if (!detail) {
      return false;
    }


    return detail.benar;

  };


  // ========================================================
  // CLASS NOMOR
  // ========================================================

  const getNumberClass = (
    nomor: number
  ) => {

    if (!submitted) {

      return "numberCell";

    }


    return isAnswerCorrect(
      nomor
    )

      ? "numberCell correctCell"

      : "numberCell wrongCell";

  };


  // ========================================================
  // CLASS JAWABAN
  // ========================================================

  const getAnswerClass = (
    nomor: number
  ) => {

    if (!submitted) {

      return "";

    }


    return isAnswerCorrect(
      nomor
    )

      ? "answerCellCorrect"

      : "answerCellWrong";

  };


  // ========================================================
  // RENDER
  // ========================================================

  return (

    <main className="page">

      <div className="container">


        {/* ==================================================
            HEADER
        =================================================== */}

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


        {/* ==================================================
            HASIL
        =================================================== */}

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


              {/* SCORE */}

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


              {/* LEGEND */}

              <div className="legend">

                <span className="legendCorrect">
                  ✓ Benar
                </span>


                <span className="legendWrong">
                  ✕ Salah
                </span>

              </div>


              {/* STATUS PENYIMPANAN */}

              {saveStatus && (

                <div className="saveStatus">
                  {saveStatus}
                </div>

              )}


            </div>

          )}


        {/* ==================================================
            ERROR
        =================================================== */}

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


        {/* ==================================================
            FORM
        =================================================== */}

        <form
          onSubmit={handleSubmit}
        >


          {/* ==================================================
              DATA PESERTA
          =================================================== */}

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

                  <span>
                    *
                  </span>

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

                  <span>
                    *
                  </span>

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


          {/* ==================================================
              SOAL
              
              Semua Soal 1 & 2 sekarang
              dipindahkan ke soal.tsx
          =================================================== */}

          <Soal

            q14Answers={
              q14Answers
            }

            implementations={
              implementations
            }

            submitted={
              submitted
            }

            updateQ14={
              updateQ14
            }

            updateImplementation={
              updateImplementation
            }

            getAnswerDetail={
              getAnswerDetail
            }

            isAnswerCorrect={
              isAnswerCorrect
            }

            getNumberClass={
              getNumberClass
            }

            getAnswerClass={
              getAnswerClass
            }

          />


          {/* ==================================================
              BUTTON
          =================================================== */}

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
                      MEMPROSES...
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


        {/* ==================================================
            FOOTER
        =================================================== */}

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