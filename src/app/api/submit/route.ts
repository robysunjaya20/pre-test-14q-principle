import { NextResponse } from "next/server";

export const runtime = "nodejs";

const GOOGLE_SCRIPT_URL =
  process.env.GOOGLE_SCRIPT_URL;

export async function POST(request: Request) {
  try {
    console.log("=================================");
    console.log("API SUBMIT DIMULAI");
    console.log("=================================");

    // ==========================================
    // CEK ENV
    // ==========================================

    if (!GOOGLE_SCRIPT_URL) {
      console.error(
        "GOOGLE_SCRIPT_URL tidak ditemukan"
      );

      return NextResponse.json(
        {
          success: false,
          message:
            "GOOGLE_SCRIPT_URL tidak ditemukan di .env.local",
        },
        { status: 500 }
      );
    }

    console.log(
      "Google Script URL:",
      GOOGLE_SCRIPT_URL
    );


    // ==========================================
    // BACA DATA
    // ==========================================

    const data = await request.json();

    console.log(
      "Data peserta:",
      data.nama,
      data.department
    );


    // ==========================================
    // KIRIM KE GOOGLE APPS SCRIPT
    // ==========================================

    let googleResponse: Response;

    try {

      googleResponse = await fetch(
        GOOGLE_SCRIPT_URL,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify(data),

          redirect: "follow",

          cache: "no-store",

          signal: AbortSignal.timeout(
            30000
          ),
        }
      );

    } catch (error) {

      console.error(
        "GAGAL CONNECT KE GOOGLE APPS SCRIPT:"
      );

      console.error(error);

      return NextResponse.json(
        {
          success: false,

          message:
            "Next.js tidak dapat terhubung ke Google Apps Script.",

          detail:
            error instanceof Error
              ? error.message
              : String(error),

          url:
            GOOGLE_SCRIPT_URL,
        },
        {
          status: 502,
        }
      );

    }


    // ==========================================
    // BACA RESPONSE
    // ==========================================

    const responseText =
      await googleResponse.text();

    console.log(
      "Google HTTP Status:",
      googleResponse.status
    );

    console.log(
      "Google Response:",
      responseText
    );


    // ==========================================
    // CEK STATUS
    // ==========================================

    if (!googleResponse.ok) {

      return NextResponse.json(
        {
          success: false,

          message:
            `Google Apps Script mengembalikan HTTP ${googleResponse.status}`,

          detail:
            responseText.substring(
              0,
              1000
            ),
        },
        {
          status: 502,
        }
      );

    }


    // ==========================================
    // PARSE JSON
    // ==========================================

    let result;

    try {

      result =
        JSON.parse(
          responseText
        );

    } catch (error) {

      console.error(
        "Response Google bukan JSON:"
      );

      console.error(
        responseText
      );

      return NextResponse.json(
        {
          success: false,

          message:
            "Google Apps Script tidak mengembalikan JSON.",

          detail:
            responseText.substring(
              0,
              1000
            ),
        },
        {
          status: 502,
        }
      );

    }


    // ==========================================
    // RETURN
    // ==========================================

    console.log(
      "Hasil Google:",
      result
    );

    return NextResponse.json(
      result
    );


  } catch (error) {

    console.error(
      "ERROR API SUBMIT:"
    );

    console.error(
      error
    );


    return NextResponse.json(
      {
        success: false,

        message:
          error instanceof Error
            ? error.message
            : "Terjadi kesalahan pada server.",

      },
      {
        status: 500,
      }
    );

  }
}