"use strict";
var PreferenceBackground = "Sheet";
var PreferenceMessage = "";
var PreferenceColorPick = "";
var PreferenceSubscreen = "";
var PreferenceChatColorThemeSelected = "";
var PreferenceChatColorThemeList = null;
var PreferenceChatColorThemeIndex = 0;
var PreferenceChatEnterLeaveSelected = "";
var PreferenceChatEnterLeaveList = null;
var PreferenceChatEnterLeaveIndex = 0;
var PreferenceChatMemberNumbersSelected = "";
var PreferenceChatMemberNumbersList = null;
var PreferenceChatMemberNumbersIndex = 0;
var PreferenceSettingsSensDepList = null;
var PreferenceSettingsSensDepIndex = 0;
var PreferenceSettingsVolumeList = null;
var PreferenceSettingsVolumeIndex = 0;

// When player logs in
function PreferenceInit(Player) {
	AfkTimerSetEnabled(Player.GameplaySettings && Player.GameplaySettings.EnableAfkTimer != false);
}

// When the preference screens loads
function PreferenceLoad() {

	// Sets up the player label color
	if (!CommonIsColor(Player.LabelColor)) Player.LabelColor = "#ffffff";
	ElementCreateInput("InputCharacterLabelColor", "text", Player.LabelColor);

	// If the user never set the chat settings before, construct them to replicate the default behavior
	if (!Player.ChatSettings) Player.ChatSettings = {
		DisplayTimestamps: true,
		ColorNames: true,
		ColorActions: true,
		ColorEmotes: true
	};

	// If the user never set the visual settings before, construct them to replicate the default behavior
	if (!Player.VisualSettings) Player.VisualSettings = {
		ForceFullHeight: false
	};

	// If the user never set the audio settings before, construct them to replicate the default behavior
    if (!Player.AudioSettings || (typeof Player.AudioSettings.Volume !== "number") || (typeof Player.AudioSettings.PlayBeeps !== "boolean")) Player.AudioSettings = {
        Volume: 1,
        PlayBeeps: false
    };

	// GameplaySettings
	if (!Player.GameplaySettings)
		Player.GameplaySettings = {};
	if (typeof Player.GameplaySettings.SensDepChatLog !== "string")
		Player.GameplaySettings.SensDepChatLog = "Normal";
	if (typeof Player.GameplaySettings.BlindDisableExamine !== "boolean")
		Player.GameplaySettings.BlindDisableExamine = false;
	if (typeof Player.GameplaySettings.DisableAutoRemoveLogin !== "boolean")
		Player.GameplaySettings.DisableAutoRemoveLogin = false;
	if (typeof Player.GameplaySettings.EnableAfkTimer !== "boolean")
		Player.GameplaySettings.EnableAfkTimer = true;

	// Sets the chat themes
	PreferenceChatColorThemeList = ["Light", "Dark"];
	PreferenceChatEnterLeaveList = ["Normal", "Smaller", "Hidden"];
	PreferenceChatMemberNumbersList = ["Always", "Never", "OnMouseover"];
	PreferenceSettingsSensDepList = ["Normal", "SensDepNames", "SensDepTotal"];
    PreferenceSettingsVolumeList = [1, 0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9];
	PreferenceChatColorThemeIndex = (!Player.ChatSettings || PreferenceChatColorThemeList.indexOf(Player.ChatSettings.ColorTheme) < 0) ? 0 : PreferenceChatColorThemeList.indexOf(Player.ChatSettings.ColorTheme);
	PreferenceChatEnterLeaveIndex = (!Player.ChatSettings || PreferenceChatEnterLeaveList.indexOf(Player.ChatSettings.EnterLeave) < 0) ? 0 : PreferenceChatEnterLeaveList.indexOf(Player.ChatSettings.EnterLeave);
	PreferenceChatMemberNumbersIndex = (!Player.ChatSettings || PreferenceChatMemberNumbersList.indexOf(Player.ChatSettings.MemberNumbers) < 0) ? 0 : PreferenceChatMemberNumbersList.indexOf(Player.ChatSettings.MemberNumbers);
	PreferenceSettingsSensDepIndex = (!Player.GameplaySettings || PreferenceSettingsSensDepList.indexOf(Player.GameplaySettings.SensDepChatLog) < 0 ) ? 0 : PreferenceSettingsSensDepList.indexOf(Player.GameplaySettings.SensDepChatLog);
    PreferenceSettingsVolumeIndex = (!Player.AudioSettings || PreferenceSettingsVolumeList.indexOf(Player.AudioSettings.Volume) < 0) ? 0 : PreferenceSettingsVolumeList.indexOf(Player.AudioSettings.Volume);
	PreferenceChatColorThemeSelected = PreferenceChatColorThemeList[PreferenceChatColorThemeIndex];
	PreferenceChatEnterLeaveSelected = PreferenceChatEnterLeaveList[PreferenceChatEnterLeaveIndex];
	PreferenceChatMemberNumbersSelected = PreferenceChatMemberNumbersList[PreferenceChatMemberNumbersIndex];

}

// Run the preference screen
function PreferenceRun() {
	
	// If a subscreen is active, draw that instead
	if (PreferenceSubscreen == "Chat") return PreferenceSubscreenChatRun();
	if (PreferenceSubscreen == "Audio") return PreferenceSubscreenAudioRun();

	// Draw the online preferences
	MainCanvas.textAlign = "left";
	DrawText(TextGet("Preferences"), 500, 125, "Black", "Gray");
    if (PreferenceMessage != "") DrawText(TextGet(PreferenceMessage), 865, 125, "Red", "Black");
	DrawText(TextGet("CharacterLabelColor"), 500, 225, "Black", "Gray");
	ElementPosition("InputCharacterLabelColor", 990, 212, 250);
	if (CommonIsColor(ElementValue("InputCharacterLabelColor"))) document.getElementById("InputCharacterLabelColor").style.color = ElementValue("InputCharacterLabelColor");
	else document.getElementById("InputCharacterLabelColor").style.color = Player.LabelColor;
	document.getElementById("InputCharacterLabelColor").style.backgroundColor = "#000000";
	DrawButton(1140, 187, 65, 65, "", "White", "Icons/Color.png");
	DrawButton(500, 280, 90, 90, "", "White", "Icons/Next.png");
	DrawText(TextGet("ItemPermission") + " " + TextGet("PermissionLevel" + Player.ItemPermission.toString()), 615, 325, "Black", "Gray");
	DrawText(TextGet("SensDepSetting"), 800, 428, "Black", "Gray");
	
	// Checkboxes
	DrawCheckbox(500, 472, 64, 64, TextGet("BlindDisableExamine"), Player.GameplaySettings.BlindDisableExamine);
	DrawCheckbox(500, 552, 64, 64, TextGet("DisableAutoRemoveLogin"), Player.GameplaySettings.DisableAutoRemoveLogin);
	DrawCheckbox(500, 632, 64, 64, TextGet("EnableAfkTimer"), Player.GameplaySettings.EnableAfkTimer);
	DrawCheckbox(500, 712, 64, 64, TextGet("ForceFullHeight"), Player.VisualSettings.ForceFullHeight);

	MainCanvas.textAlign = "center";
	DrawBackNextButton(500, 392, 250, 64, TextGet(Player.GameplaySettings.SensDepChatLog), "White", "",
		() => TextGet(PreferenceSettingsSensDepList[(PreferenceSettingsSensDepIndex + PreferenceSettingsSensDepList.length - 1) % PreferenceSettingsSensDepList.length]),
		() => TextGet(PreferenceSettingsSensDepList[(PreferenceSettingsSensDepIndex + 1) % PreferenceSettingsSensDepList.length]));

	// Draw the player & controls
	DrawCharacter(Player, 50, 50, 0.9);
	DrawButton(1815, 75, 90, 90, "", "White", "Icons/Exit.png");
	if (PreferenceColorPick != "") {
		ColorPickerDraw(1250, 185, 675, 830, document.getElementById(PreferenceColorPick));
	} else {
    	ColorPickerHide();
		DrawButton(1815, 190, 90, 90, "", "White", "Icons/Chat.png");
		DrawButton(1815, 305, 90, 90, "", "White", "Icons/Audio.png");
	}
}

// When the user clicks in the preference screen
function PreferenceClick() {

	// If a subscreen is active, process that instead
	if (PreferenceSubscreen == "Chat") return PreferenceSubscreenChatClick();
	if (PreferenceSubscreen == "Audio") return PreferenceSubscreenAudioClick();

	// If the user clicks on "Exit"
	if ((MouseX >= 1815) && (MouseX < 1905) && (MouseY >= 75) && (MouseY < 165) && (PreferenceColorPick == "")) PreferenceExit();

	// If the user clicks on the chat settings button
	if ((MouseX >= 1815) && (MouseX < 1905) && (MouseY >= 190) && (MouseY < 280) && (PreferenceColorPick == "")) {
		ElementRemove("InputCharacterLabelColor");
		PreferenceSubscreen = "Chat";
	}

	// If the user clicks on the audio settings button
	if ((MouseX >= 1815) && (MouseX < 1905) && (MouseY >= 305) && (MouseY < 395) && (PreferenceColorPick == "")) {
		ElementRemove("InputCharacterLabelColor");
		PreferenceSubscreen = "Audio";
	}

	// If we must change the restrain permission level
	if ((MouseX >= 500) && (MouseX < 590) && (MouseY >= 280) && (MouseY < 370)) {
		Player.ItemPermission++;
		if (Player.ItemPermission > 5) Player.ItemPermission = 0;
	}

	// If we must show/hide/use the color picker
	if ((MouseX >= 1140) && (MouseX < 1205) && (MouseY >= 187) && (MouseY < 252)) PreferenceColorPick = (PreferenceColorPick != "InputCharacterLabelColor") ? "InputCharacterLabelColor" : "";
	if ((MouseX >= 1815) && (MouseX < 1905) && (MouseY >= 75) && (MouseY < 165) && (PreferenceColorPick != "")) PreferenceColorPick = "";

    // If we must change audio gameplay or visual settings
	if ((MouseX >= 500) && (MouseX < 750) && (MouseY >= 392) && (MouseY < 456)) {
		if (MouseX <= 625) PreferenceSettingsSensDepIndex = (PreferenceSettingsSensDepList.length + PreferenceSettingsSensDepIndex - 1) % PreferenceSettingsSensDepList.length;
		else PreferenceSettingsSensDepIndex = (PreferenceSettingsSensDepIndex + 1) % PreferenceSettingsSensDepList.length;
		Player.GameplaySettings.SensDepChatLog = PreferenceSettingsSensDepList[PreferenceSettingsSensDepIndex];
	}

	// Preference check boxes
	if (CommonIsClickAt(500, 472, 64, 64)) Player.GameplaySettings.BlindDisableExamine = !Player.GameplaySettings.BlindDisableExamine;
	if (CommonIsClickAt(500, 552, 64, 64)) Player.GameplaySettings.DisableAutoRemoveLogin = !Player.GameplaySettings.DisableAutoRemoveLogin;
	if (CommonIsClickAt(500, 632, 64, 64)) {
		Player.GameplaySettings.EnableAfkTimer = !Player.GameplaySettings.EnableAfkTimer;
		AfkTimerSetEnabled(Player.GameplaySettings.EnableAfkTimer);
	}
	if (CommonIsClickAt(500, 712, 64, 64)) Player.VisualSettings.ForceFullHeight = !Player.VisualSettings.ForceFullHeight;

}

// When the user exit the preference screen, we push the data back to the server
function PreferenceExit() {
	if (CommonIsColor(ElementValue("InputCharacterLabelColor"))) {
		Player.LabelColor = ElementValue("InputCharacterLabelColor");
		var P = {
			ItemPermission: Player.ItemPermission,
			LabelColor: Player.LabelColor,
			ChatSettings: Player.ChatSettings,
			VisualSettings: Player.VisualSettings,
			AudioSettings: Player.AudioSettings,		
			GameplaySettings: Player.GameplaySettings
		};
		ServerSend("AccountUpdate", P);
		PreferenceMessage = "";
		ElementRemove("InputCharacterLabelColor");
		CommonSetScreen("Character", "InformationSheet");
	} else PreferenceMessage = "ErrorInvalidColor";
}

// Redirected to from the main Run function if the player is in the audio settings subscreen
function PreferenceSubscreenAudioRun () {
	DrawCharacter(Player, 50, 50, 0.9);
	MainCanvas.textAlign = "left";
	DrawText(TextGet("AudioPreferences"), 500, 125, "Black", "Gray");
	DrawText(TextGet("AudioVolume"), 800, 225, "Black", "Gray");
	DrawText(TextGet("AudioPlayBeeps"), 600, 305, "Black", "Gray");
    DrawButton(500, 272, 64, 64, "", "White", (Player.AudioSettings && Player.AudioSettings.PlayBeeps) ? "Icons/Checked.png" : "");
    DrawText(TextGet("AudioPlayItem"), 600, 385, "Black", "Gray");
	DrawButton(500, 352, 64, 64, "", "White", (Player.AudioSettings && Player.AudioSettings.PlayItem) ? "Icons/Checked.png" : "");
	MainCanvas.textAlign = "center";
    DrawBackNextButton(500, 193, 250, 64, Player.AudioSettings.Volume * 100 + "%", "White", "",
        () => PreferenceSettingsVolumeList[(PreferenceSettingsVolumeIndex + PreferenceSettingsVolumeList.length - 1) % PreferenceSettingsVolumeList.length] * 100 + "%",
        () => PreferenceSettingsVolumeList[(PreferenceSettingsVolumeIndex + 1) % PreferenceSettingsVolumeList.length] * 100 + "%");
	DrawButton(1815, 75, 90, 90, "", "White", "Icons/Exit.png");
}

// Redirected to from the main Run function if the player is in the chat settings subscreen
function PreferenceSubscreenChatRun() {
	MainCanvas.textAlign = "left";
	DrawText(TextGet("ChatPreferences"), 500, 125, "Black", "Gray");
	DrawText(TextGet("ColorTheme"), 500, 225, "Black", "Gray");
	DrawText(TextGet("EnterLeaveStyle"), 500, 325, "Black", "Gray");
	DrawText(TextGet("DisplayMemberNumbers"), 500, 425, "Black", "Gray");
	DrawText(TextGet("DisplayTimestamps"), 600, 525, "Black", "Gray");
	DrawText(TextGet("ColorNames"), 600, 625, "Black", "Gray");
	DrawText(TextGet("ColorActions"), 600, 725, "Black", "Gray");
	DrawText(TextGet("ColorEmotes"), 600, 825, "Black", "Gray");
	MainCanvas.textAlign = "center";
	DrawBackNextButton(1000, 190, 350, 70, TextGet(PreferenceChatColorThemeSelected), "White", "",
		() => TextGet((PreferenceChatColorThemeIndex == 0) ? PreferenceChatColorThemeList[PreferenceChatColorThemeList.length - 1] : PreferenceChatColorThemeList[PreferenceChatColorThemeIndex - 1]),
		() => TextGet((PreferenceChatColorThemeIndex >= PreferenceChatColorThemeList.length - 1) ? PreferenceChatColorThemeList[0] : PreferenceChatColorThemeList[PreferenceChatColorThemeIndex + 1]));
	DrawBackNextButton(1000, 290, 350, 70, TextGet(PreferenceChatEnterLeaveSelected), "White", "",
		() => TextGet((PreferenceChatEnterLeaveIndex == 0) ? PreferenceChatEnterLeaveList[PreferenceChatEnterLeaveList.length - 1] : PreferenceChatEnterLeaveList[PreferenceChatEnterLeaveIndex - 1]),
		() => TextGet((PreferenceChatEnterLeaveIndex >= PreferenceChatEnterLeaveList.length - 1) ? PreferenceChatEnterLeaveList[0] : PreferenceChatEnterLeaveList[PreferenceChatEnterLeaveIndex + 1]));
	DrawBackNextButton(1000, 390, 350, 70, TextGet(PreferenceChatMemberNumbersSelected), "White", "",
		() => TextGet((PreferenceChatMemberNumbersIndex == 0) ? PreferenceChatMemberNumbersList[PreferenceChatMemberNumbersList.length - 1] : PreferenceChatMemberNumbersList[PreferenceChatMemberNumbersIndex - 1]),
		() => TextGet((PreferenceChatMemberNumbersIndex >= PreferenceChatMemberNumbersList.length - 1) ? PreferenceChatMemberNumbersList[0] : PreferenceChatMemberNumbersList[PreferenceChatMemberNumbersIndex + 1]));
	DrawButton(500, 492, 64, 64, "", "White", (Player.ChatSettings && Player.ChatSettings.DisplayTimestamps) ? "Icons/Checked.png" : "");
	DrawButton(500, 592, 64, 64, "", "White", (Player.ChatSettings && Player.ChatSettings.ColorNames) ? "Icons/Checked.png" : "");
	DrawButton(500, 692, 64, 64, "", "White", (Player.ChatSettings && Player.ChatSettings.ColorActions) ? "Icons/Checked.png" : "");
	DrawButton(500, 792, 64, 64, "", "White", (Player.ChatSettings && Player.ChatSettings.ColorEmotes) ? "Icons/Checked.png" : "");
	DrawButton(1815, 75, 90, 90, "", "White", "Icons/Exit.png");
	DrawCharacter(Player, 50, 50, 0.9);
}

// When the user clicks in the audio preference subscreen
function PreferenceSubscreenAudioClick() {

	// If the user clicked the exit icon to return to the main screen
	if ((MouseX >= 1815) && (MouseX < 1905) && (MouseY >= 75) && (MouseY < 165) && (PreferenceColorPick == "")) {
		PreferenceSubscreen = "";
		ElementCreateInput("InputCharacterLabelColor", "text", Player.LabelColor);
	}

	// Volume increase/decrease control
    if ((MouseX >= 500) && (MouseX < 750) && (MouseY >= 193) && (MouseY < 257)) {
        if (MouseX <= 625) PreferenceSettingsVolumeIndex = (PreferenceSettingsVolumeList.length + PreferenceSettingsVolumeIndex - 1) % PreferenceSettingsVolumeList.length;
        else PreferenceSettingsVolumeIndex = (PreferenceSettingsVolumeIndex + 1) % PreferenceSettingsVolumeList.length;
        Player.AudioSettings.Volume = PreferenceSettingsVolumeList[PreferenceSettingsVolumeIndex];
    }

	// Individual audio check-boxes
	if ((MouseX >= 500) && (MouseX < 564)) {
		if ((MouseY >= 272) && (MouseY < 336)) Player.AudioSettings.PlayBeeps = !Player.AudioSettings.PlayBeeps;
		if ((MouseY >= 352) && (MouseY < 416)) Player.AudioSettings.PlayItem = !Player.AudioSettings.PlayItem;
	}

}

// Redirected to from the main Click function if the player is in the chat settings subscreen
function PreferenceSubscreenChatClick() {

	// If the user clicked one of the check-boxes
	if ((MouseX >= 500) && (MouseX < 564)) {
		if ((MouseY >= 492) && (MouseY < 556)) Player.ChatSettings.DisplayTimestamps = !Player.ChatSettings.DisplayTimestamps;
		if ((MouseY >= 592) && (MouseY < 656)) Player.ChatSettings.ColorNames = !Player.ChatSettings.ColorNames;
		if ((MouseY >= 692) && (MouseY < 756)) Player.ChatSettings.ColorActions = !Player.ChatSettings.ColorActions;
		if ((MouseY >= 792) && (MouseY < 856)) Player.ChatSettings.ColorEmotes = !Player.ChatSettings.ColorEmotes;
	}

	// If the user used one of the BackNextButtons
	if ((MouseX >= 1000) && (MouseX < 1350) && (MouseY >= 190) && (MouseY < 270)) {
		if (MouseX <= 1175) PreferenceChatColorThemeIndex = (PreferenceChatColorThemeIndex <= 0) ? PreferenceChatColorThemeList.length - 1 : PreferenceChatColorThemeIndex - 1;
		else PreferenceChatColorThemeIndex = (PreferenceChatColorThemeIndex >= PreferenceChatColorThemeList.length - 1) ? 0 : PreferenceChatColorThemeIndex + 1;
		PreferenceChatColorThemeSelected = PreferenceChatColorThemeList[PreferenceChatColorThemeIndex];
		Player.ChatSettings.ColorTheme = PreferenceChatColorThemeSelected;
	}
	if ((MouseX >= 1000) && (MouseX < 1350) && (MouseY >= 290) && (MouseY < 370)) {
		if (MouseX <= 1175) PreferenceChatEnterLeaveIndex = (PreferenceChatEnterLeaveIndex <= 0) ? PreferenceChatEnterLeaveList.length - 1 : PreferenceChatEnterLeaveIndex - 1;
		else PreferenceChatEnterLeaveIndex = (PreferenceChatEnterLeaveIndex >= PreferenceChatEnterLeaveList.length - 1) ? 0 : PreferenceChatEnterLeaveIndex + 1;
		PreferenceChatEnterLeaveSelected = PreferenceChatEnterLeaveList[PreferenceChatEnterLeaveIndex];
		Player.ChatSettings.EnterLeave = PreferenceChatEnterLeaveSelected;
	}
	if ((MouseX >= 1000) && (MouseX < 1350) && (MouseY >= 390) && (MouseY < 470)) {
		if (MouseX <= 1175) PreferenceChatMemberNumbersIndex = (PreferenceChatMemberNumbersIndex <= 0) ? PreferenceChatMemberNumbersList.length - 1 : PreferenceChatMemberNumbersIndex - 1;
		else PreferenceChatMemberNumbersIndex = (PreferenceChatMemberNumbersIndex >= PreferenceChatMemberNumbersList.length - 1) ? 0 : PreferenceChatMemberNumbersIndex + 1;
		PreferenceChatMemberNumbersSelected = PreferenceChatMemberNumbersList[PreferenceChatMemberNumbersIndex];
		Player.ChatSettings.MemberNumbers = PreferenceChatMemberNumbersSelected;
	}

	// If the user clicked the exit icon to return to the main screen
	if ((MouseX >= 1815) && (MouseX < 1905) && (MouseY >= 75) && (MouseY < 165) && (PreferenceColorPick == "")) {
		PreferenceSubscreen = "";
		ElementCreateInput("InputCharacterLabelColor", "text", Player.LabelColor);
	}

}

// Return true if sensory deprivation is active
function PreferenceIsPlayerInSensDep() {
	return (Player.GameplaySettings && ((Player.GameplaySettings.SensDepChatLog == "SensDepNames") || (Player.GameplaySettings.SensDepChatLog == "SensDepTotal")) && (Player.Effect.indexOf("DeafHeavy") >= 0) && (Player.Effect.indexOf("BlindHeavy") >= 0));
}