/*
    This file contains functions for initializing form fields,
    resolving database paths, and moving from the database JSON
    representation of a form to the PDFMake representation
*/

///////////////////////////////////////////////////////////////
/* ------------ BEGIN GENERIC HELPER FUNCTIONS ------------- */
///////////////////////////////////////////////////////////////

//Set the data field to whatever today's date is
function initDateField(date_field_id) {
    $(DATE_FIELD_ID)[0].valueAsDate = new Date();
}

//Gets the appropriate club based on the logged in user so we know where to store in the database
function getClub() {
    var club;
    switch (firebase.auth().currentUser.email) {
    case "occstaff@bngc.com":
        club = "carmichael";
        break;
    case "occadmin@bngc.com":
        club = "carmichael";
        break;
    case "wilsonstaff@bngc.com":
        club = "wilson";
        break;
    case "wilsonadmin@bngc.com":
        club = "wilson";
        break;
    case "lasallestaff@bngc.com":
        club = "lasalle";
        break;
    case "lasalleadmin@bngc.com":
        club = "lasalle";
        break;
    case "harrisonstaff@bngc.com":
        club = "harrison";
        break;
    case "harrisonadmin@bngc.com":
        club = "harrison";
        break;
    case "battellstaff@bngc.com":
        club = "battell";
        break;
    case "battelladmin@bngc.com":
        club = "battell";
        break;
    default:
        club = "none";
        break;
    }
    return club;
}

// Take the JSON key that we store in our database for a form and map to what should appear on a PDF for that key
// We did this so there aren't arduously long keys in the database JSON and we can be more wordy on the PDF
function jsonToFormText(json_key) {
    if (json_key == "childName") {
        return "\nName";
    } else if (json_key == "memberId") {
        return "\nMember ID";
    } else if (json_key == "date") {
        return "\nDate";
    } else if (json_key == "staffName") {
        return "\nName of Staff Member";
    } else if (json_key == "witnessName") {
        return "\nWitness/People Involved";
    } else if (json_key == "location") {
        return "\nLocation of Incident";
    } else if (json_key == "incidentDescription") {
        return "\nNature of the Incident";
    } else if (json_key == "responseDescription") {
        return "\nStaff Person's Response";
    } else if (json_key == "treatment") {
        return "\nTreatment Given";
    } else if (json_key == "nature") {
        return "\nNature of the Head Injury";
    } else if (json_key == "parentNotified") {
        return "\nParent Notified";
    } else if (json_key == "issuerName") {
        return "\nIssued By";
    } else if (json_key == "behaviors") {
        return "\nInappropriate Behavior Type";
    } else if (json_key == "consequences") {
        return "\nConsequences";
    } else if (json_key == "staffComments") {
        return "\nStaff Comments";
    } else {
        console.log("Unknown json key " + json_key);
        return ""
    }
}


// Add a signature line for the staff at the given content indx of the content section of the PDF document_definition.
// There's an index because some form generations need it inserted
function addStaffSignatureTo(document_definition) {
    document_definition.content.push({
        text: '\n\nStaff Signature: _____________________________________________\n\nSignature Date: _____________________________________________',
        style: 'form_field_title'
    });
    return document_definition;
}

//Add a signature line for manager at the end of the content section of the PDF document_definition
function addManagerSignatureTo(document_definition) {
    document_definition.content.push({
        text: '\n\nBranch Director Signature: _____________________________________________',
        style: 'form_field_title'
    });
    document_definition.content.push({
        text: '\nSignature Date: ________________________________________________________',
        style: 'form_field_title'
    });
    return document_definition;
}


///////////////////////////////////////////////////////////////
/* ------- BEGIN GENERAL INCIDENT SPECIFIC FUNCTIONS ------- */
///////////////////////////////////////////////////////////////

// Take JSON that we store in the database for a general incident and create the JSON to give to pdfmake to generate a form PDF
// See the documentation for pdfMake to understand the JSON being generated
function getGeneralIncidentJSON(form_json) {
    var document_definition = {
        content: [
            {
                image: BASE_64_BNG_LOGO,
                width: 109,
                height: 65,
                style: "logo"
            },
            {
                text: "BOYS AND GIRLS CLUBS",
                style: "main_header"
            },
            {
                text: "OF ST. JOSEPH COUNTY",
                style: "sub_header"
            },
            {
                text: "\nGeneral Incident Report",
                style: "form_title"
            }
        ],
        styles: {
            logo: {
                alignment: "center"
            },
            main_header: {
                fontSize: 20,
                bold: true,
                alignment: "center"
            },
            sub_header: {
                fontSize: 15,
                alignment: "center"
            },
            form_title: {
                fontSize: 18,
                alignment: "center"
            },
            form_field_title: {
                bold: true,
                fontSize: 12,
                alignment: 'left'
            },
            form_field: {
                fontSize: 12,
                alignment: 'left'
            }
        }
    }
    document_definition = addGeneralIncidentInputsTo(document_definition, form_json);
    document_definition = addStaffSignatureTo(document_definition);
    document_definition = addManagerSignatureTo(document_definition)
    return document_definition;
}

//Take the database JSON representation of a form and add them to the pdfmake document_definition JSON
function addGeneralIncidentInputsTo(document_definition, form_json) {
    for (var key in form_json) {
        if (form_json.hasOwnProperty(key)) { //Check this isn't some prototype property key not specific to our object
            var title = {
                text: jsonToFormText(key) + '',
                style: 'form_field_title'
            };
            var txt = {
                text: form_json[key],
                style: 'form_field'
            };
            document_definition.content.push(title);
            document_definition.content.push(txt);
        }
    }
    return document_definition;
}


///////////////////////////////////////////////////////////////
/* -------- BEGIN ACCIDENT FORM SPECIFIC FUNCTIONS --------- */
///////////////////////////////////////////////////////////////

// Take JSON that we store in the database for a accident form and create the JSON to give to pdfmake to generate a form PDF
// See the documentation for pdfMake to understand the JSON being generated
function getAccidentJSON(form_json) {
    var document_definition = {
        content: [
            {
                image: BASE_64_BNG_LOGO,
                width: 109,
                height: 65,
                style: "logo"
            },
            {
                text: "BOYS AND GIRLS CLUBS",
                style: "main_header"
            },
            {
                text: "OF ST. JOSEPH COUNTY",
                style: "sub_header"
            },
            {
                text: "\nAccident Report",
                style: "form_title"
            }
        ],
        styles: {
            logo: {
                alignment: "center"
            },
            main_header: {
                fontSize: 20,
                bold: true,
                alignment: "center"
            },
            sub_header: {
                fontSize: 15,
                alignment: "center"
            },
            form_title: {
                fontSize: 18,
                alignment: "center"
            },
            form_field_title: {
                bold: true,
                fontSize: 12,
                alignment: 'left'
            },
            form_field: {
                fontSize: 12,
                alignment: 'left'
            }
        }
    }
    document_definition = addAccidentInputsTo(document_definition, form_json);
    document_definition = addStaffSignatureTo(document_definition);

    //If a head injury occured, add appropriate pages
    if (form_json["nature"] != undefined && form_json["treatment"] != undefined) { //If true, a head injury occured
        document_definition = addHeadInjuryFormTo(document_definition, form_json);
        document_definition = addHeadInjuryAdviceTo(document_definition);
    }
    return document_definition;
}

//Take the form inputs and add them to the pdf document definition
function addAccidentInputsTo(document_definition, form_json) {
    for (var key in form_json) {
        if (form_json.hasOwnProperty(key)) { //Check this isn't some prototype property key not specific to our object
            if (key != "nature" && key != "treatment") { // Check this isn't a head injury field (we'll add those later)
                var title = {
                    text: jsonToFormText(key) + '',
                    style: 'form_field_title'
                };
                var txt = {
                    text: form_json[key],
                    style: 'form_field'
                };
                document_definition.content.push(title);
                document_definition.content.push(txt);
            }
        }
    }
    return document_definition;
}

//Add the parent information head injury form to the PDF json
function addHeadInjuryFormTo(document_definition, form_json) {
    document_definition.content.push({
        text: "Head Injury Report\n",
        pageBreak: "before",
        style: "form_title"
    });
    document_definition.content.push({
        text: "\nDate: " + form_json['date']
    });
    document_definition.content.push({
        text: "Child: " + form_json['childName']
    });
    document_definition.content.push({
        text: "\nDear Parent/Guardian:\n\nToday, your child had an injury to his/her head. At present, he/she does not seem to exhibit any alarming symptoms. However, bumps or blows to the head sometimes cause a mild brain injury called a concussion. Signs of head injury can occur immediately or develop over several hours. Be alert and watch for the following symptoms:\n"
    });
    document_definition.content.push({
        text: "\n"
    });
    document_definition.content.push({
        ul: [
                "Persistent headache and or stiff neck",
                "Slurred speech or blurry vision",
                "Any episodes of nausea or vomiting",
                "Loss of muscle coordination-unsteady walking, staggering balance, or weakness in an arm, hand or leg",
                "Having more trouble than usual remembering things, concentrating or making decisions",
                "Becoming easily irritated for little or no reason",
                "Any loss of conciseness",
                "Feeling sad, anxious or listless",
                "Extreme drowsiness or unable to arouse from sleep",
                "Any excess bleeding from the wound. Blood or clear watery liquid coming from the ears or nose",
                "Avoid all sedatives or narcotics\n"
            ]
    });

    document_definition.content.push({
        text: "\nIt is important to call or see your doctor immediately if any of the above signs are observed in your child."
    });

    document_definition.content.push({
        text: jsonToFormText("nature") + '',
        style: 'form_field_title'
    });

    document_definition.content.push({
        text: form_json["nature"],
        style: 'form_field'
    });

    document_definition.content.push({
        text: jsonToFormText("treatment") + '',
        style: 'form_field_title'
    });

    document_definition.content.push({
        text: form_json["treatment"],
        style: 'form_field'
    });

    document_definition.content.push({
        text: "\nPlease note: This advice is a collaboration of general researched practices and is not intended as a substitute for medical advice, diagnosis, or treatment. Always seek the advice of a qualified health provided with any questions you may have regarding a medical condition. Never disregard professional advice or delay in seeking it because of the information provided above. If you think your child may have a medical emergency, call your doctor or 911 immediately."
    });
    return document_definition;
}


//Add the head injury advice to the PDF json
function addHeadInjuryAdviceTo(document_definition) {
    document_definition.content.push({
        text: "MONITORING YOUR CONDITION FOR IMPORTANT SIGNS AND SYMPTOMS\n",
        pageBreak: "before",
        style: "form_field_title"
    });
    document_definition.content.push({
        text: "\nThe following information will help you and a support person monitor your condition. The support person should stay with you for at least 24 hours. It is important that you both understand what to watch for, and know when and where to obtain help. Monitoring during the first 24 hours following injury is the most critical; however, you may need to continue for several days. Your health care provider will give you specific instructions about how long to continue the monitoring.\n"
    });

    document_definition.content.push({
        text: "\nDuring the first 24 hours, you should have your support person wake you every hour and check with you about the following items:\n",
        style: "form_field_title"
    });

    document_definition.content.push({
        ul: [
            "Ask you the date, time and place",
            "Ask your name and the name of the support person",
            "Notice if you are exhibiting any unusual behaviors or actions",
            "Notice if your walking or arm movements are clumsy\n"
        ]
    });

    document_definition.content.push({
        text: "\nYou and/or your support person should report any of the following symptoms:\n",
        style: "form_field_title"
    });

    document_definition.content.push({
        text: '\n'
    });
    document_definition.content.push({
        image: EYES_BASE64,
        width: 233,
        height: 88,
        style: "logo"
    });

    document_definition.content.push({
        ul: [
            "Unusual sleepiness or difficulty awakening",
            "Convulsions (seizures)",
            "Mental confusion or stranger behavior",
            "Amnesia or short-term memory loss",
            "Vomiting that continues and/or worsens",
            "Restlessness or agitation that continues and/or worsens",
            "Stiff neck",
            "Unequal pupils or peculiar eye movements (see figure 1)",
            "Visual changes",
            "Changes in speech, or perseverating (repeating the same word(s) over and over)",
            "Inability to move arms and legs equally on both sides, or weakness or loss of feeling in arm or leg",
            "Clear or bloody drainage from the ears or nose",
            "Raccoon eyes (resembles a black eye) or Battle Sign (dark spots behind the ears(s))",
            "Difficulty breathing or unusual breathing pattern",
            "A worsening headache that is not relieved by acetaminophen (Tylenol, etc.)",
            "A temperature above 100 degrees F",
            "Slow or rapid pulse",
            "Loss of bowel or bladder control\n"
        ]
    });

    document_definition.content.push({
        text: "\nIf you are concerned about any difference in your treatment plan and the information in this handout, you are advised to contact your health care provider.",
        style: "form_field_title"
    });

    return document_definition;
}


///////////////////////////////////////////////////////////////
/* ------- BEGIN MEMBER BEHAVIOR SPECIFIC FUNCTIONS -------- */
///////////////////////////////////////////////////////////////

//This is a listing that maps from our database JSON keys to the longer behavior descriptions
// This way we don't need arduosly long keys for our JSON
function getBehaviorMapping(json_key) {
    if (json_key == "talking") {
        return "Talking at inappropriate times";
    } else if (json_key == "not_listening") {
        return "Not listening to staff or following direction";
    } else if (json_key == "language") {
        return "Inappropriate language/profanity";
    } else if (json_key == "gestures") {
        return "Inappropriate body language/gestures";
    } else if (json_key == "BGC_rules") {
        return "Lack of respect for BGC rules/procedures";
    } else if (json_key == "member_disrespect") {
        return "Disrespectful towards other members";
    } else if (json_key == "staff_disrespect") {
        return "Disrespectful towards staff";
    } else if (json_key == "name_calling") {
        return "Name calling/labeling of others";
    } else if (json_key == "touching") {
        return "Improper touching of others";
    } else if (json_key == "physical_contact") {
        return "Kicking, hitting, pushing, etc.";
    } else if (json_key == "fighting") {
        return "Fighting";
    } else if (json_key == "threatening") {
        return "Threatening/intimidating others";
    } else if (json_key == "stealing_cheating") {
        return "Stealing/cheating";
    } else if (json_key == "property_damage") {
        return "Damage to property";
    } else if (json_key == "behavior_other") {
        return "Other (suicide tendencies, illegal substances, weapons, etc.): ";
    } else {
        console.log("Unknown behavior " + json_key);
        return "";
    }
}

//This is a listing that maps from our database JSON keys to the longer consequence descriptions
// This way we don't need arduosly long keys for our JSON
function getConsequenceMapping(json_key) {
    if (json_key == "event_loss") {
        return "Loss of an activity/event";
    } else if (json_key == "conference") {
        return "Parent conference";
    } else if (json_key == "parent_contact") {
        return "Parents contacted";
    } else if (json_key == "suspension") {
        return "Out of club suspension";
    } else if (json_key == "consequence_other") {
        return "Other:";
    } else {
        console.log("Unknown consequence " + json_key);
        return "";
    }
}

//Take the form and turn it to JSON to make a pdf
function getBehaviorJSON(form_json) {
    var document_definition = {
        content: [
            {
                image: BASE_64_BNG_LOGO,
                width: 109,
                height: 65,
                style: "center"
      },
            {
                text: "BOYS AND GIRLS CLUBS",
                style: "main_header"
      },
            {
                text: "OF ST. JOSEPH COUNTY",
                style: "sub_header"
      },
            {
                text: "\nMember Behavior Report",
                style: "form_title"
      },
            {
                text: "\n*Fighting, blatant disrespect of staff or others, and destruction of property all result in an automatic 3-day suspension from the club",
                style: "suspension_header"
      },
    ],
        styles: {
            suspension_header: {
                alignment: "center",
                bold: "true"
            },
            center: {
                alignment: "center"
            },
            main_header: {
                fontSize: 20,
                bold: true,
                alignment: "center"
            },
            sub_header: {
                fontSize: 15,
                alignment: "center"
            },
            form_title: {
                fontSize: 18,
                alignment: "center"
            },
            form_field_title: {
                bold: true,
                fontSize: 12,
                alignment: 'left'
            },
            form_field: {
                fontSize: 12,
                alignment: 'left'
            }
        }
    }
    document_definition = addBehaviorInputsTo(document_definition, form_json);
    document_definition = addBehaviorDropdown(document_definition, form_json);
    document_definition = addConsequenceDropdown(document_definition, form_json);
    document_definition = addExtraLinesTo(document_definition);
    return document_definition;
}

//Take the form inputs and add them to the pdf document definition
function addBehaviorInputsTo(document_definition, form_json) {
    for (var key in form_json) {
        if (form_json.hasOwnProperty(key)) { //Check this isn't some prototype property key not specific to our object
            if (key != "behaviors" && key != "consequences") { // Check this isn't a list of potential checkboxes (we'll add those later)
                var title = {
                    text: jsonToFormText(key) + '',
                    style: 'form_field_title'
                };
                var txt = {
                    text: form_json[key],
                    style: 'form_field'
                };
                document_definition.content.push(title);
                document_definition.content.push(txt);
            }
        }
    }
    return document_definition;
}

//Look for which behaviors were checked and add them to the PDF JSON
function addBehaviorDropdown(document_definition, form_json) {
    document_definition.content.push({
        text: jsonToFormText("behaviors") + '',
        style: 'form_field_title'
    });
    for (var key in form_json["behaviors"]) {
        if (form_json['behaviors'][key] === true) { // Check this isn't a list of potential checkboxes (we'll add those later)
            var txt = getBehaviorMapping(key);
            if (key == "behavior_other") { //We need to get the custom text if there is a other behvaior.
                txt += " ";
                txt += form_json["behaviors"]["other_behavior"];
            }

            document_definition.content.push({
                text: txt,
                style: 'form_field'
            });
        }
    }
    return document_definition;
}

//Look for which consequences were checked and add them to the PDF JSON
function addConsequenceDropdown(document_definition, form_json) {
    document_definition.content.push({
        text: jsonToFormText("consequences") + '',
        style: 'form_field_title'
    });
    for (var key in form_json["consequences"]) {
        if (form_json['consequences'][key] === true) { // Check this isn't a list of potential checkboxes (we'll add those later)
            var txt = getConsequenceMapping(key);
            if (key == "consequence_other") { //We need to get the custom text if there is a other consequence.
                txt += " ";
                txt += form_json["consequences"]["other_consequence"];
            }

            document_definition.content.push({
                text: txt,
                style: 'form_field'
            });
        }
    }
    return document_definition;
}

//Add some lines at the bottom specific to this form
function addExtraLinesTo(document_definition) {
    document_definition.content.push({
        text: '\nPlease discuss this behavior with your child. Contact your club director if you have any questions about this report. Please note that if inappropriate behavior/incidents continue, it may result in automatic suspension or termination from the club. Thank you.',
        style: 'form_field'
    });
    document_definition.content.push({
        text: '\nClub Director/Authorized Signature: _____________________________________________',
        style: 'form_field_title'
    });
    document_definition.content.push({
        text: '\nParent/Guardian Signature: _____________________________________________\n(Must be returned signed in order for member to re-enter club)',
        style: 'form_field_title'
    });
    return document_definition;
}
