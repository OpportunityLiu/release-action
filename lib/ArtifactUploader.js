"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const ErrorMessage_1 = require("./ErrorMessage");
class GithubArtifactUploader {
    constructor(releases) {
        this.releases = releases;
    }
    async uploadArtifacts(artifacts, uploadUrl) {
        artifacts.forEach(async (artifact) => {
            try {
                await this.releases.uploadArtifact(uploadUrl, artifact.contentLength, artifact.contentType, artifact.readFile(), artifact.name);
            }
            catch (error) {
                const message = `Failed to upload artifact ${artifact.name}. Does it already exist?`;
                core.warning(message);
                const errorMessage = new ErrorMessage_1.ErrorMessage(error);
                core.debug(errorMessage.toString());
            }
        });
    }
}
exports.GithubArtifactUploader = GithubArtifactUploader;
