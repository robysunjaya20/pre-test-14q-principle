"use client";

import React from "react";

export type Implementation = {
  list: string;
  area: string;
};

export type AnswerDetail = {
  nomor: number;
  jawabanPeserta: string;
  jawabanBenar: string;
  benar: boolean;
};

type SoalProps = {
  q14Answers: string[];
  implementations: Implementation[];
  submitted: boolean;
  updateQ14: (
    index: number,
    value: string
  ) => void;
  updateImplementation: (
    index: number,
    field: "list" | "area",
    value: string
  ) => void;
  getAnswerDetail: (
    nomor: number
  ) => AnswerDetail | undefined;
  isAnswerCorrect: (
    nomor: number
  ) => boolean;
  getNumberClass: (
    nomor: number
  ) => string;
  getAnswerClass: (
    nomor: number
  ) => string;
};

export default function Soal({
  q14Answers,
  implementations,
  submitted,
  updateQ14,
  updateImplementation,
  getAnswerDetail,
  isAnswerCorrect,
  getNumberClass,
  getAnswerClass,
}: SoalProps) {

  return (
    <>

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

    </>
  );
}