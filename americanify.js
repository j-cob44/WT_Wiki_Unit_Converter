// Conversion Functions
function convertAltitude(meters){
  var feet = meters * 3.28;
  return feet.toFixed(0);
}

function convertClimbSpeed(metersPerSecond){
  var feet = metersPerSecond * 60 * 3.28;
  return feet.toFixed(0);
}

function convertSpeed(kmh){
  var mph = kmh / 1.609344;
  return mph.toFixed(0);
}

// Parse Functions
function ParseSpaces(input){
  var output = input.replace(/\s+/g, ''); // remove spaces

  return output
}

function ParseValue(input){
  // input format: "at 1 500 m"
  var output = input.replace(/[^0-9.]/g,''); // remove non-digits

  return output; // return "1500"
}

async function main() {
  // Main Code
  var page_type;
  // Determine Page Type;
  var links = document.getElementsByTagName("a");
  for (var i = 0; i < links.length; i++) {
    if (links[i].title == "Category:Aviation") {
      page_type = "aviation";
      break;
    }
    if (links[i].title == "Category:Fleet") {
      page_type = "fleet";
      break;
    }
    if (links[i].title == "Category:Ground vehicles") {
      page_type = "ground";
      break;
    }
    if (links[i].title == "Category:Helicopters") {
      page_type = "helicopters";
      break;
    }
  }

  // Aircraft Page Conversion
  if (page_type == "aviation") {
    var page_specs_info = document.getElementsByClassName("specs_info");

    var plane_specs;
    var survivability_specs;

    for (var i = 0; i < page_specs_info.length; i++) {
      // Find Plane Specs
      if (ParseSpaces(page_specs_info[i].getElementsByClassName("name")[0].innerHTML) == "Maxspeed") {
        plane_specs = page_specs_info[i];
      }

      // Find Survivability Specs
      if (page_specs_info[i].getElementsByClassName("name")[1]) {
        if (ParseSpaces(page_specs_info[i].getElementsByClassName("name")[1].innerHTML) == "Speedofdestruction") {
          survivability_specs = page_specs_info[i];
        }
      }
    }

    // Flight performance conversion
    if (plane_specs) {
      var plane_specs_blocks = plane_specs.getElementsByClassName("specs_char_block");
      var plane_speed = plane_specs_blocks[0];
      var plane_speed_alti = plane_speed.getElementsByClassName("name")[1];
      var plane_speed_value = plane_speed.getElementsByClassName("value")[1];

      // Convert Max speed at altitude
      var max_speed_at_feet = convertAltitude(ParseValue(plane_speed_alti.innerHTML));
      plane_speed_alti.innerHTML = "at " + max_speed_at_feet + " feet";

      var max_speed_in_mph = convertSpeed(ParseValue(plane_speed_value.innerHTML));
      plane_speed_value.innerHTML = max_speed_in_mph + " mph";
      // End max speed conversion

      // Convert Max altitude
      var plane_altitude = plane_specs_blocks[2];
      var plane_max_alti = plane_altitude.getElementsByClassName("value")[0];
      var max_altitude_in_feet = convertAltitude(ParseValue(plane_max_alti.innerHTML));
      plane_max_alti.innerHTML = max_altitude_in_feet + " feet";
      // End max altitude conversion
    }
    // End flight performance conversions

    // Flight Survivability Conversions
    if (survivability_specs) {
      var survivability_specs_block = survivability_specs.getElementsByClassName("specs_char_block")[1];
      var survivability_specs_block_values = survivability_specs_block.getElementsByClassName("value");

      for (var i = 0; i < survivability_specs_block_values.length; i++) {
        if (ParseSpaces(survivability_specs_block_values[i].innerHTML) != "") {
          var destruction_speed = convertSpeed(ParseValue(survivability_specs_block_values[i].innerHTML));
          survivability_specs_block_values[i].innerHTML = destruction_speed + " mph";
        }
      }
    }
    // End Survivability Conversions

    var wiki_tables = document.getElementsByClassName("wikitable");

    // Find Data Tables
    var characteristics_table;
    var limits_table;
    var velocities_table;
    var compressor_table;
    for (var i = 0; i < wiki_tables.length; i++) {
      // Check if Characteristics Table
      if (ParseSpaces(wiki_tables[i].getElementsByTagName("tr")[0].getElementsByTagName("th")[0].innerHTML) == "Characteristics") {
        characteristics_table = wiki_tables[i]
      }

      // Check if Limits Table
      if (ParseSpaces(wiki_tables[i].getElementsByTagName("tr")[0].getElementsByTagName("th")[0].innerHTML) == "Limits") {
        limits_table = wiki_tables[i]
      }

      // Check if Optimal Velocities Tables
      if (ParseSpaces(wiki_tables[i].getElementsByTagName("tr")[0].getElementsByTagName("th")[0].innerHTML) == "Optimalvelocities(km/h)") {
        velocities_table = wiki_tables[i]
      }

      // Check if Compressor Table
      if (ParseSpaces(wiki_tables[i].getElementsByTagName("tr")[0].getElementsByTagName("th")[0].innerHTML) == "Compressor(RB/SB)") {
        compressor_table = wiki_tables[i]
      }
    }

    // Vehicle Characteristics Table Conversion
    if (characteristics_table) {
      // Get all rows
      var ctable_rows = characteristics_table.getElementsByTagName("tr");

      // Header Row Conversions
      var ctrow1_headers = ctable_rows[0].getElementsByTagName("th");
      var ctrow1_max_speed_at_altitude = convertAltitude(ParseValue(ctrow1_headers[1].innerHTML));
      ctrow1_headers[1].innerHTML = "Max Speed <br> (mph at " + ctrow1_max_speed_at_altitude + " feet)";

      ctrow1_headers[2].innerHTML = "Max altitude <br> (feet)";
      ctrow1_headers[4].innerHTML = "Rate of Climb <br> (feet/minute)";
      ctrow1_headers[5].innerHTML = "Take-off Run <br> (feet)";
      // End Header Row Conversions

      // Stock Row Conversions
      var ctrow3_stock = ctable_rows[2].getElementsByTagName("td");

      var ctrow3_ms_ab = convertSpeed(ParseValue(ctrow3_stock[0].innerHTML));
      ctrow3_stock[0].innerHTML = ctrow3_ms_ab;

      var ctrow3_ms_rb = convertSpeed(ParseValue(ctrow3_stock[1].innerHTML));
      ctrow3_stock[1].innerHTML = ctrow3_ms_rb;

      var ctrow3_max_alti = convertAltitude(ParseValue(ctrow3_stock[2].innerHTML));
      ctrow3_stock[2].innerHTML = ctrow3_max_alti;

      var ctrow3_roc_ab = convertClimbSpeed(ParseValue(ctrow3_stock[5].innerHTML));
      ctrow3_stock[5].innerHTML = ctrow3_roc_ab;

      var ctrow3_roc_rb = convertClimbSpeed(ParseValue(ctrow3_stock[6].innerHTML));
      ctrow3_stock[6].innerHTML = ctrow3_roc_rb;

      var ctrow3_tor = convertAltitude(ParseValue(ctrow3_stock[7].innerHTML));
      ctrow3_stock[7].innerHTML = ctrow3_tor;
      // End Stock Row Conversions

      // Upgraded Row Conversions
      var ctrow4_stock = ctable_rows[3].getElementsByTagName("td");

      var ctrow4_ms_ab = convertSpeed(ParseValue(ctrow4_stock[0].innerHTML));
      ctrow4_stock[0].innerHTML = ctrow4_ms_ab;

      var ctrow4_ms_rb = convertSpeed(ParseValue(ctrow4_stock[1].innerHTML));
      ctrow4_stock[1].innerHTML = ctrow4_ms_rb;

      var ctrow4_roc_ab = convertClimbSpeed(ParseValue(ctrow4_stock[4].innerHTML));
      ctrow4_stock[4].innerHTML = ctrow4_roc_ab;

      var ctrow4_roc_rb = convertClimbSpeed(ParseValue(ctrow4_stock[5].innerHTML));
      ctrow4_stock[5].innerHTML = ctrow4_roc_rb;
      // End Upgraded Row Conversions
    }

    // Vehicle Limits Table Conversion
    if (limits_table) {
      // Get all rows
      var ltable_rows = limits_table.getElementsByTagName("tr");

      // Header Row Conversions
      var ltrow1_headers = ltable_rows[1].getElementsByTagName("th");

      ltrow1_headers[0].innerHTML = "Wings (mph)";
      ltrow1_headers[1].innerHTML = "Gear (mph)";
      ltrow1_headers[2].innerHTML = "Flaps (mph)";
      // End Header Row Conversions

      // Limits Row Conversions
      var ltrow3_limits = ltable_rows[3].getElementsByTagName("td");

      var ltrow3_wings_limit = convertSpeed(ParseValue(ltrow3_limits[0].innerHTML));
      ltrow3_limits[0].innerHTML = ltrow3_wings_limit;

      var ltrow3_gear_limit = convertSpeed(ParseValue(ltrow3_limits[1].innerHTML));
      ltrow3_limits[1].innerHTML = ltrow3_gear_limit;

      if (ParseSpaces(ltrow3_limits[2].innerHTML) != "N/A") {
        var ltrow3_cmbt_flaps = convertSpeed(ParseValue(ltrow3_limits[2].innerHTML));
        ltrow3_limits[2].innerHTML = ltrow3_cmbt_flaps;
      }
      if (ParseSpaces(ltrow3_limits[3].innerHTML) != "N/A") {
        var ltrow3_to_flaps = convertSpeed(ParseValue(ltrow3_limits[3].innerHTML));
        ltrow3_limits[3].innerHTML = ltrow3_to_flaps;
      }
      if (ParseSpaces(ltrow3_limits[4].innerHTML) != "N/A") {
        var ltrow3_landing_flaps = convertSpeed(ParseValue(ltrow3_limits[4].innerHTML));
        ltrow3_limits[4].innerHTML = ltrow3_landing_flaps;
      }
      // End Limits Row Conversions
    }

    // Optimal Velocity Table Conversion
    if (velocities_table) {
      var vtable_rows = velocities_table.getElementsByTagName("tr");

      // Header Row Conversions
      var vtrow_headers = vtable_rows[0].getElementsByTagName("th");
      vtrow_headers[0].innerHTML = "Optimal velocities (mph)";
      // End Header Row Conversions

      // Optimal Velocities Row Conversions
      var vtrow_optimals = vtable_rows[2].getElementsByTagName("td");

      for (var i = 0; i < vtrow_optimals.length; i++) {
        if (ParseSpaces(vtrow_optimals[i].innerHTML) != "N/A") {
          var sign = ParseSpaces(vtrow_optimals[i].innerHTML);
          sign = sign.substr(0, 4);

          if (ParseValue(vtrow_optimals[i].innerHTML) != "") { // Fix for when wiki does not list optimal velocities: ex "< ___" or "> ___"
            var optimal_conversion = convertSpeed(ParseValue(vtrow_optimals[i].innerHTML));
            vtrow_optimals[i].innerHTML = sign + " " + optimal_conversion;
          }
        }
      }
      // End Optimal Velocities Row Conversions
    }

    // Compressor Table Optimal Altitude Conversion
    if (compressor_table) {
      var comptable_rows = compressor_table.getElementsByTagName("tr");
      var comptable_optimalaltitude = comptable_rows[3].getElementsByTagName("td")[0];

      var converted_altitude = convertAltitude(ParseValue(comptable_optimalaltitude.innerHTML));
      comptable_optimalaltitude.innerHTML = converted_altitude + " feet";
    }
  }
  // End Aircraft Page Conversions

  // Fleet Page Conversion
  if (page_type == "fleet") {
    var page_specs_info = document.getElementsByClassName("specs_info");

    var mobility_specs;

    for (var i = 0; i < page_specs_info.length; i++) {
      // Find Mobility Specs
      if (ParseSpaces(page_specs_info[i].getElementsByClassName("name")[0].innerHTML) == "Speed") {
        mobility_specs = page_specs_info[i];
      }
    }

    // Convert Mobility Specs
    if (mobility_specs) {
      var fleet_mobility_block = mobility_specs.getElementsByClassName("specs_char_block")[0];
      var fleet_mobility_values = fleet_mobility_block.getElementsByClassName("value");

      for (var i = 0; i < fleet_mobility_values.length; i++) {
        if (ParseSpaces(fleet_mobility_values[i].innerHTML) != "forward/back") {
          var speed_values = ParseSpaces(fleet_mobility_values[i].innerHTML).split("/");
          var forward = convertSpeed(ParseValue(speed_values[0]));
          var backward = convertSpeed(ParseValue(speed_values[1]));

          fleet_mobility_values[i].innerHTML = forward + " / " + backward + " mph";
        }
      }
    }
    // End Mobility Specs

    //
    var wiki_tables = document.getElementsByClassName("wikitable");

    // Find Data Tables
    var mobility_characteristics_table;
    for (var i = 0; i < wiki_tables.length; i++) {
      // Check if Mobility Characteristics Table
      if (ParseSpaces(wiki_tables[i].getElementsByTagName("tr")[1].getElementsByTagName("th")[0].innerHTML) == "GameMode") {
        console.log("found");
        mobility_characteristics_table = wiki_tables[i]
      }
    }

    // Vehicle Characteristics Table Conversion
    if (mobility_characteristics_table) {
      // Get all rows
      var mctable_rows = mobility_characteristics_table.getElementsByTagName("tr");

      // Header Row Conversions
      var mctrow1_headers = mctable_rows[1].getElementsByTagName("th");
      mctrow1_headers[2].innerHTML = "Maximum Speed (mph)";
      // End Header Row Conversions

      // AB Row Conversions
      var mctrow3_ab = mctable_rows[4].getElementsByTagName("td");

      var mctrow3_forward = convertSpeed(ParseValue(mctrow3_ab[1].innerHTML));
      mctrow3_ab[1].innerHTML = mctrow3_forward;

      var mctrow3_reverse = convertSpeed(ParseValue(mctrow3_ab[2].innerHTML));
      mctrow3_ab[2].innerHTML = mctrow3_reverse;
      // End AB Row Conversions

      // RB/SB Row Conversions
      var mctrow4_rbsb = mctable_rows[6].getElementsByTagName("td");

      var mctrow4_forward = convertSpeed(ParseValue(mctrow4_rbsb[1].innerHTML));
      mctrow4_rbsb[1].innerHTML = mctrow4_forward;

      var mctrow4_reverse = convertSpeed(ParseValue(mctrow4_rbsb[2].innerHTML));
      mctrow4_rbsb[2].innerHTML = mctrow4_reverse;
      // End RB/SB Row Conversions
    }
  }
  // End Fleet Page Conversions

  // Ground Page Conversions
  if (page_type == "ground") {
    var page_specs_info = document.getElementsByClassName("specs_info");

    var mobility_specs;

    for (var i = 0; i < page_specs_info.length; i++) {
      // Find Mobility Specs
      if (page_specs_info[i].getElementsByClassName("name")[0]) {
        if (ParseSpaces(page_specs_info[i].getElementsByClassName("name")[0].innerHTML) == "Speed") {
          mobility_specs = page_specs_info[i];
        }
      }
    }

    // Convert Mobility Specs
    if (mobility_specs) {
      var ground_mobility_block = mobility_specs.getElementsByClassName("specs_char_block")[0];
      var ground_speed_values = ground_mobility_block.getElementsByClassName("value");

      for (var i = 0; i < ground_speed_values.length; i++) {
        if (ParseSpaces(ground_speed_values[i].innerHTML) != "forward/back") {
          var speed_values = ParseSpaces(ground_speed_values[i].innerHTML).split("/");
          var forward = convertSpeed(ParseValue(speed_values[0]));
          var backward = convertSpeed(ParseValue(speed_values[1]));

          ground_speed_values[i].innerHTML = forward + " / " + backward + " mph";
        }
      }
    }
    // End Mobility Specs

    var wiki_tables = document.getElementsByClassName("wikitable");

    // Find Data Tables
    var ground_characteristics_table;
    for (var i = 0; i < wiki_tables.length; i++) {
      // Check if Mobility Characteristics Table
      if (ParseSpaces(wiki_tables[i].getElementsByTagName("tr")[0].getElementsByTagName("th")[0].innerHTML) == "GameMode") {
        console.log("found");
        ground_characteristics_table = wiki_tables[i]
      }
    }

    // Vehicle Characteristics Table Conversion
    if (ground_characteristics_table) {
      // Get all rows
      var gctable_rows = ground_characteristics_table.getElementsByTagName("tr");

      // Header Row Conversions
      var gctrow1_headers = gctable_rows[0].getElementsByTagName("th");
      gctrow1_headers[1].innerHTML = "Max Speed (mph)";
      // End Header Row Conversions

      // Arcade Row Conversions
      var gctrow3_arcade = gctable_rows[2].getElementsByTagName("td");

      var gctrow3_forward = convertSpeed(ParseValue(gctrow3_arcade[0].innerHTML));
      gctrow3_arcade[0].innerHTML = gctrow3_forward;

      var gctrow3_reverse = convertSpeed(ParseValue(gctrow3_arcade[1].innerHTML));
      gctrow3_arcade[1].innerHTML = gctrow3_reverse;
      // End AB Row Conversions

      // Realistic Row Conversions
      var gctrow4_realistics = gctable_rows[3].getElementsByTagName("td");

      var gctrow4_forward = convertSpeed(ParseValue(gctrow4_realistics[0].innerHTML));
      gctrow4_realistics[0].innerHTML = gctrow4_forward;

      var gctrow4_reverse = convertSpeed(ParseValue(gctrow4_realistics[1].innerHTML));
      gctrow4_realistics[1].innerHTML = gctrow4_reverse;
      // End RB/SB Row Conversions
    }
  }
  // End Fleet Page Conversions

  // Helicopter Page conversions
  if (page_type == "helicopters") {
    var page_specs_info = document.getElementsByClassName("specs_info");

    var heli_specs;
    var survivability_specs;

    for (var i = 0; i < page_specs_info.length; i++) {
      // Find Helicopter Specs
      if (page_specs_info[i].getElementsByClassName("name")[0]) {
        if (ParseSpaces(page_specs_info[i].getElementsByClassName("name")[0].innerHTML) == "Maxspeed") {
          heli_specs = page_specs_info[i];
        }
      }

      // Find Survivability Specs
      if (page_specs_info[i].getElementsByClassName("name")[1]) {
        if (ParseSpaces(page_specs_info[i].getElementsByClassName("name")[1].innerHTML) == "Speedofdestruction") {
          survivability_specs = page_specs_info[i];
        }
      }
    }

    // Flight performance conversion
    if (heli_specs) {
      var heli_specs_blocks = heli_specs.getElementsByClassName("specs_char_block");
      var heli_speed = heli_specs_blocks[0];
      var heli_speed_alti = heli_speed.getElementsByClassName("name")[1];
      var heli_speed_value = heli_speed.getElementsByClassName("value")[1];

      // Convert Max speed at altitude
      var max_speed_at_feet = convertAltitude(ParseValue(heli_speed_alti.innerHTML));
      heli_speed_alti.innerHTML = "at " + max_speed_at_feet + " feet";

      var max_speed_in_mph = convertSpeed(ParseValue(heli_speed_value.innerHTML));
      heli_speed_value.innerHTML = max_speed_in_mph + " mph";
      // End max speed conversion

      // Convert Max altitude
      var heli_altitude = heli_specs_blocks[1];
      var heli_max_alti = heli_altitude.getElementsByClassName("value")[0];
      var max_altitude_in_feet = convertAltitude(ParseValue(heli_max_alti.innerHTML));
      heli_max_alti.innerHTML = max_altitude_in_feet + " feet";
      // End max altitude conversion
    }
    // End flight performance conversions

    // Flight Survivability Conversions
    if (survivability_specs) {
      var survivability_specs_block = survivability_specs.getElementsByClassName("specs_char_block")[1];
      var survivability_specs_block_values = survivability_specs_block.getElementsByClassName("value");

      for (var i = 0; i < survivability_specs_block_values.length; i++) {
        if (ParseSpaces(survivability_specs_block_values[i].innerHTML) != "") {
          var destruction_speed = convertSpeed(ParseValue(survivability_specs_block_values[i].innerHTML));
          survivability_specs_block_values[i].innerHTML = destruction_speed + " mph";
        }
      }
    }
    // End Survivability Conversions

    var wiki_tables = document.getElementsByClassName("wikitable");

    // Find Data Tables
    var characteristics_table;
    for (var i = 0; i < wiki_tables.length; i++) {
      // Check if Characteristics Table
      if (ParseSpaces(wiki_tables[i].getElementsByTagName("tr")[0].getElementsByTagName("th")[0].innerHTML) == "Characteristics") {
        characteristics_table = wiki_tables[i]
      }
    }

    // Heli Characteristics Table Conversion
    if (characteristics_table) {
      // Get all rows
      var ctable_rows = characteristics_table.getElementsByTagName("tr");

      // Header Row Conversions
      var ctrow1_headers = ctable_rows[0].getElementsByTagName("th");
      var ctrow1_max_speed_at_altitude = convertAltitude(ParseValue(ctrow1_headers[1].innerHTML));
      ctrow1_headers[1].innerHTML = "Max Speed <br> (mph at " + ctrow1_max_speed_at_altitude + " feet)";

      ctrow1_headers[2].innerHTML = "Max altitude <br> (feet)";
      // End Header Row Conversions

      // Stock Row Conversions
      var ctrow3_stock = ctable_rows[2].getElementsByTagName("td");

      var ctrow3_ms_ab = convertSpeed(ParseValue(ctrow3_stock[0].innerHTML));
      ctrow3_stock[0].innerHTML = ctrow3_ms_ab;

      var ctrow3_ms_rb = convertSpeed(ParseValue(ctrow3_stock[1].innerHTML));
      ctrow3_stock[1].innerHTML = ctrow3_ms_rb;

      var ctrow3_max_alti = convertAltitude(ParseValue(ctrow3_stock[2].innerHTML));
      ctrow3_stock[2].innerHTML = ctrow3_max_alti;
      // End Stock Row Conversions

      // Upgraded Row Conversions
      var ctrow4_upgraded = ctable_rows[3].getElementsByTagName("td");

      var ctrow4_ms_ab = convertSpeed(ParseValue(ctrow4_upgraded[0].innerHTML));
      ctrow4_upgraded[0].innerHTML = ctrow4_ms_ab;

      var ctrow4_ms_rb = convertSpeed(ParseValue(ctrow4_upgraded[1].innerHTML));
      ctrow4_upgraded[1].innerHTML = ctrow4_ms_rb;
      // End Upgraded Row Conversions
    }
  }
}

main();
