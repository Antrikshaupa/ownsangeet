/**
 * Google Apps Script for handling the contact form submission.
 * This script will receive data from the React form and append it to a Google Sheet.
 */

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var sheet =
      SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Submissions");

    // If sheet doesn't exist, create it and add headers
    if (!sheet) {
      sheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet("Submissions");
      sheet.appendRow([
        "Timestamp",
        "Name",
        "Email",
        "Phone",
        "EventType",
        "ServiceRequired",
        "Language",
        "Style",
        "Message",
      ]);
    }

    var timestamp = new Date();
    sheet.appendRow([
      timestamp,
      data.name,
      data.email,
      data.phone,
      data.eventType,
      data.serviceRequired,
      data.language,
      data.style,
      data.message,
    ]);

    return ContentService.createTextOutput(
      JSON.stringify({ result: "success" })
    ).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(
      JSON.stringify({ result: "error", error: error.toString() })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

// Sample test function to simulate a POST submission and log the response
function testDoPost() {
  var sampleData = {
    name: "Test User",
    email: "test@example.com",
    phone: "123-456-7890",
    eventType: "Test Event",
    serviceRequired: "Test Service",
    language: "English",
    style: "Test Style",
    message: "This is a test message.",
  };
  var mockEvent = { postData: { contents: JSON.stringify(sampleData) } };
  var result = doPost(mockEvent);
  Logger.log("doPost response: " + result.getContent());
}

// Simple HTML form endpoint for manual testing via GET
function doGet() {
  return HtmlService.createHtmlOutput(
    "<!DOCTYPE html><html><body>" +
      '<form onsubmit="handleSubmit();return false;">' +
      '<input id="name" placeholder="Name"><br>' +
      '<input id="email" placeholder="Email"><br>' +
      '<input id="phone" placeholder="Phone"><br>' +
      '<input id="eventType" placeholder="Event Type"><br>' +
      '<input id="serviceRequired" placeholder="Service Required"><br>' +
      '<input id="language" placeholder="Language"><br>' +
      '<input id="style" placeholder="Style"><br>' +
      '<textarea id="message" placeholder="Message"></textarea><br>' +
      '<button type="submit">Submit</button>' +
      "<script>" +
      "function handleSubmit(){" +
      "var data={" +
      'name:document.getElementById("name").value,' +
      'email:document.getElementById("email").value,' +
      'phone:document.getElementById("phone").value,' +
      'eventType:document.getElementById("eventType").value,' +
      'serviceRequired:document.getElementById("serviceRequired").value,' +
      'language:document.getElementById("language").value,' +
      'style:document.getElementById("style").value,' +
      'message:document.getElementById("message").value};' +
      'fetch(window.location.href,{method:"post",headers:{"Content-Type":"application/json"},body:JSON.stringify(data)})' +
      ".then(r=>r.json()).then(r=>alert(JSON.stringify(r))).catch(e=>alert(e));" +
      "}" +
      "</script>" +
      "</body></html>"
  );
}
