import { NextRequest, NextResponse } from "next/server";

/**
 * Google Apps Script Web App
 */
const SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbyAkBLk99dbLdDByCiITO0sfeapD1KMyuX6VivPhjHJ4QJa2i9INvsykA14ta840mpGpg/exec";


export async function POST(
  request: NextRequest
) {

  try {

    console.log(
      "================================="
    );

    console.log(
      "SUBMIT 14Q ASSESSMENT"
    );

    console.log(
      "================================="
    );


    // AMBIL BODY

    const body =
      await request.text();


    console.log(
      "Request body:",
      body
    );


    // CEK BODY

    if (
      !body ||
      body.trim() === ""
    ) {

      return NextResponse.json(
        {
          success: false,
          message:
            "Data yang dikirim kosong.",
        },
        {
          status: 400,
        }
      );

    }


    // KIRIM KE GOOGLE APPS SCRIPT

    const response =
      await fetch(
        SCRIPT_URL,
        {

          method: "POST",

          headers: {

            "Content-Type":
              request.headers.get(
                "content-type"
              ) ||
              "application/json",

          },

          body: body,

          redirect: "follow",

          cache: "no-store",

        }
      );


    // BACA RESPONSE

    const responseText =
      await response.text();


    console.log(
      "Google HTTP Status:",
      response.status
    );


    console.log(
      "Google Response:",
      responseText
    );


    // RESPONSE KOSONG

    if (
      !responseText ||
      responseText.trim() === ""
    ) {

      return NextResponse.json(
        {

          success: false,

          message:
            "Google Apps Script tidak mengembalikan response.",

          status:
            response.status,

        },
        {
          status: 502,
        }
      );

    }


    // PARSE JSON

    let data: any;


    try {

      data =
        JSON.parse(
          responseText
        );

    } catch (error) {

      console.error(
        "Response Google Apps Script bukan JSON."
      );

      console.error(
        responseText
      );


      return NextResponse.json(
        {

          success: false,

          message:
            "Response Google Apps Script bukan JSON.",

          status:
            response.status,

          detail:
            responseText.substring(
              0,
              2000
            ),

        },
        {
          status: 502,
        }
      );

    }


    // GOOGLE SCRIPT ERROR

    if (!data.success) {

      console.error(
        "Google Apps Script gagal:",
        data
      );


      return NextResponse.json(
        {

          success: false,

          message:
            data.message ||
            "Google Apps Script gagal menyimpan data.",

          detail:
            data.detail ||
            "",

          row:
            data.row ??
            null,

          name:
            data.name ||
            "",

          department:
            data.department ||
            "",

          tanggal:
            data.tanggal ||
            "",

          benar:
            data.benar ??
            0,

          total:
            data.total ??
            14,

          nilai:
            data.nilai ??
            0,

          details:
            Array.isArray(
              data.details
            )
              ? data.details
              : [],

        },
        {
          status: 500,
        }
      );

    }


    // BERHASIL

    console.log(
      "================================="
    );

    console.log(
      "DATA BERHASIL DISIMPAN"
    );

    console.log(
      "Nama:",
      data.name
    );

    console.log(
      "Department:",
      data.department
    );

    console.log(
      "Benar:",
      data.benar
    );

    console.log(
      "Nilai:",
      data.nilai
    );

    console.log(
      "================================="
    );


    // KIRIM KE FRONTEND

    return NextResponse.json(
      {

        success: true,

        message:
          data.message ||
          "Jawaban berhasil disimpan.",

        row:
          data.row ??
          null,

        name:
          data.name ||
          "",

        department:
          data.department ||
          "",

        tanggal:
          data.tanggal ||
          "",

        benar:
          data.benar ??
          0,

        total:
          data.total ??
          14,

        nilai:
          data.nilai ??
          0,

        details:
          Array.isArray(
            data.details
          )
            ? data.details
            : [],

      },
      {
        status: 200,
      }
    );


  } catch (error) {

    console.error(
      "================================="
    );

    console.error(
      "API SUBMIT ERROR"
    );

    console.error(
      error
    );

    console.error(
      "================================="
    );


    return NextResponse.json(
      {

        success: false,

        message:
          "Gagal menghubungkan Next.js dengan Google Apps Script.",

        detail:
          error instanceof Error
            ? error.message
            : String(error),

      },
      {
        status: 500,
      }
    );

  }

}