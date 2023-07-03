/* eslint-disable no-undef */
import IsAndroid from '../Common/IsAndroid';

const zip = (context, directory, zipPath) => {
    if (IsAndroid(context)) {
        const zipFile = new net.lingala.zip4j.ZipFile(new java.io.File(zipPath));
        const parameters = new net.lingala.zip4j.model.ZipParameters();
        parameters.setCompressionMethod(
            net.lingala.zip4j.model.enums.CompressionMethod.DEFLATE
        );
        parameters.setCompressionLevel(
            net.lingala.zip4j.model.enums.CompressionLevel.NORMAL
        );
        parameters.setIncludeRootFolder(false);
        zipFile.addFolder(new java.io.File(directory), parameters);
        return true;
    } else {
        return SSZipArchive.createZipFileAtPathWithContentsOfDirectory(zipPath, directory);
    }
};

const unzip = (context, source, destination) => {
    if (IsAndroid(context)) {
        const zipFile = new net.lingala.zip4j.ZipFile(source);
        if (zipFile.isValidZipFile()) zipFile.extractAll(destination);
        return true;
    } else {
        return SSZipArchive.unzipFileAtPathToDestination(source, destination);
    }
};

export { zip, unzip };
