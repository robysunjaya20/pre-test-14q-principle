import { NextRequest, NextResponse } from "next/server";

/*Google Apps Script Web App*/
const SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbxXCtXfw5B28gwj-eD9hg2m3Ft59u9E4_tuWDcZAT7NHlYZ7kkyxVRzrHD96r6kmYm9-Q/exec";


export async function POST(request: NextRequest) {
  try {
    console.log("=================================");
    console.log("SUBMIT 14Q ASSESSMENT");
    console.log("=================================");

    // AMBIL DATA DARI FRONTEND

    const body = await request.text();

    console.log("Request body:");
    console.log(body);
    console.log("=================================");


    // CEK DATA

    if (!body || body.trim() === "") {
      return NextResponse.json(
        {
          success: false,
          message: "Data yang dikirim kosong.",
        },
        {
          status: 400,
        }
      );
    }


    // KIRIM DATA KE GOOGLE APPS SCRIPT

    console.log("Mengirim data ke Google Apps Script...");

    const response = await fetch(
      SCRIPT_URL,
      {
        method: "POST",

        headers: {
          "Content-Type":
            request.headers.get("content-type") ||
            "application/json",
        },

        body: body,

        redirect: "follow",

        cache: "no-store",
      }
    );


    // BACA RESPONSE GOOGLE APPS SCRIPT

    const responseText =
      await response.text();

    console.log("=================================");
    console.log("GOOGLE APPS SCRIPT RESPONSE");
    console.log("HTTP Status:", response.status);
    console.log("Response:");
    console.log(responseText);
    console.log("=================================");


    // JIKA RESPONSE KOSONG

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
        JSON.parse(responseText);
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


    // GOOGLE APPS SCRIPT MENGEMBALIKAN ERROR

    if (!data.success) {

      console.error(
        "Google Apps Script gagal:"
      );

      console.error(
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

          score:
            data.score ||
            "",

          details:
            Array.isArray(data.details)
              ? data.details
              : [],
        },
        {
          status: 500,
        }
      );
    }


    // DATA BERHASIL DISIMPAN

    console.log("=================================");
    console.log("DATA BERHASIL DISIMPAN");
    console.log("=================================");

    console.log(
      "Row:",
      data.row
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
      "Tanggal:",
      data.tanggal
    );

    console.log(
      "Benar:",
      data.benar
    );

    console.log(
      "Total:",
      data.total
    );

    console.log(
      "Nilai:",
      data.nilai
    );

    console.log(
      "Details:",
      data.details
    );

    console.log(
      "=================================");


    // KIRIM HASIL KEMBALI KE FRONTEND

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

        score:
          data.score ||
          "",

        details:
          Array.isArray(data.details)
            ? data.details
            : [],
      },
      {
        status: 200,
      }
    );

  } catch (error) {

    // ERROR NEXT.JS

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