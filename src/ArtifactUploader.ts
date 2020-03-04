import * as core from '@actions/core';
import { Artifact } from "./Artifact";
import { Releases } from "./Releases";
import { ErrorMessage } from './ErrorMessage';

export interface ArtifactUploader {
    uploadArtifacts(artifacts: Artifact[], uploadUrl: string): Promise<void>
}

export class GithubArtifactUploader implements ArtifactUploader {
    private releases: Releases

    constructor(releases: Releases) {
        this.releases = releases
    }

    async uploadArtifact(artifact: Artifact, uploadUrl: string, retry = 3) {
        try {
            await this.releases.uploadArtifact(uploadUrl,
                artifact.contentLength,
                artifact.contentType,
                artifact.readFile(),
                artifact.name)
        } catch (error) {
            core.debug(new ErrorMessage(error).toString())
            if (error.status >= 500 && retry > 0) {
                core.debug(`Failed to upload artifact ${artifact.name}. Retrying...`)
                await this.uploadArtifact(artifact, uploadUrl, retry - 1)
            } else {
                core.warning(`Failed to upload artifact ${artifact.name}. Does it already exist?`)
            }
        }
    }

    async uploadArtifacts(artifacts: Artifact[], uploadUrl: string) {
        for (const artifact of artifacts) {
            await this.uploadArtifact(artifact, uploadUrl)
        }
    }
}