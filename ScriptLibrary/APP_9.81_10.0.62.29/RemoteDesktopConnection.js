/****************************************************************
 *  Functions to generate a RDP file for downloading            *
 *  Author:                                                     *             
 *      lingyan (lingyan.meng@microfocus.com)                          *
 *      zhangqi (qi.zhang@microfocus.com)                              *
 *  Date:2019/01                                                *
 *  Version:2.0                                                 *
 ****************************************************************/

function remoteDesktop(device, field) {
    
    if (device == null || field == null || field.length == 0) {
        return;
    }

    var disField;
    
    var isWin = funcs.sysinfo_get("ClientOSName").indexOf("Win") == 0;

    // windows client
    if (isWin) { 
        var command = null;
        
        if (field === "display.name") {
            disField = lib.DisplayName.getRefTableDisplayField("device");
            command = device[disField];
        }
        else if (field === "network.name") {
            command = device.network_name;
        }
        else if (field === "ip.address") {
            command = device.ip_address;
        }

        command = "WINEXEC;mstsc.exe;/v " + command + ";/";
//        print("MSTSC command launched: " + command);
        funcs.rtecall("msg", new SCDatum(), command);
    }
    // web client
    else {
        if (field === "display.name") {
            disField = lib.DisplayName.getRefTableDisplayField("device");
            remoteConnectionFile(device[disField]);
        }
        else if (field === "network.name") {
            remoteConnectionFile(device.network_name);
        }
        else if (field === "ip.address") {
            remoteConnectionFile(command = device.ip_address);
        }
    }    
}


/**
 * Create a remote connection rdp file
 */
function remoteConnectionFile(fullAddress) {

    if (fullAddress === null || fullAddress === undefined) {
        print("Please provide an ip address or a network name");
        return;
    }
    
//    print(fullAddress);

    var $ = lib.c.$;
    
    // 1.create file
    var filename = fullAddress + ".rdp";
    if (!filename.match(/^[\-_0-9a-zA-Z\.]*$/)) {
       filename = "default.rdp";
    }
    
    $.callrad("file.open.withoptions", {
            "name": filename,
            "string1":"text",
            "prompt":"write",
            "text":"utf8"
        }, false);
    
    // 2.write file
    var text = "screen mode id:i:1\n" + "use multimon:i:0\n" + "desktopwidth:i:1920\n" + "desktopheight:i:1080\n" + "session bpp:i:32\n" + "winposstr:s:0,1,147,131,1609,954\n" + "compression:i:1\n" + "keyboardhook:i:2\n" + "audiocapturemode:i:0\n" + "videoplaybackmode:i:1\n" + "connection type:i:2\n" + "displayconnectionbar:i:1\n" + "disable wallpaper:i:1\n" + "allow font smoothing:i:0\n" + "allow desktop composition:i:0\n" + "disable full window drag:i:1\n" + "disable menu anims:i:1\n" + "disable themes:i:0\n" + "disable cursor setting:i:0\n" + "bitmapcachepersistenable:i:1\n" + "full address:s:" + fullAddress + "\n" + "audiomode:i:0\n" + "redirectprinters:i:1\n" + "redirectcomports:i:0\n" + "redirectsmartcards:i:1\n" + "redirectclipboard:i:1\n" + "redirectposdevices:i:0\n" + "redirectdirectx:i:1\n" + "autoreconnection enabled:i:1\n" + "authentication level:i:2\n" + "prompt for credentials:i:0\n" + "negotiate security layer:i:1\n" + "remoteapplicationmode:i:0\n" + "alternate shell:s:\n" + "shell working directory:s:\n" + "gatewayhostname:s:\n" + "gatewayusagemethod:i:4\n" + "gatewaycredentialssource:i:4\n" + "gatewayprofileusagemethod:i:0\n" + "promptcredentialonce:i:1\n" + "use redirection server name:i:0\n" + "drivestoredirect:s:\n";
    $.callrad("file.writetxt", {
            "name": text,
            "index":vars.$G_file_currentfilenumber
        }, false);


    // 3.close file
    $.callrad("file.close", {
            "index":vars.$G_file_currentfilenumber
        }, true);

}
