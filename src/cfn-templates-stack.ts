import { runPathRecipeSync } from "@amzn/brazil";
import { DeploymentStack, DeploymentStackProps } from "@amzn/pipelines";
import { RemovalPolicy } from "aws-cdk-lib";
import {
  Bucket,
  BucketAccessControl,
  CfnAccessPoint,
  ObjectOwnership,
} from "aws-cdk-lib/aws-s3";
import { BucketDeployment, Source } from "aws-cdk-lib/aws-s3-deployment";
import { Construct } from "constructs";

export class CfnTemplatesStack extends DeploymentStack {
  readonly templatesPackageName = "AWSCodeGuruSecurityIntegrationCfnTemplates";
  readonly accessPointName = "codeguru-security";

  constructor(scope: Construct, id: string, props: DeploymentStackProps) {
    super(scope, id, props);

    const accessLogsBucket = new Bucket(this, "AccessLogsBucket");

    const s3Bucket = new Bucket(this, "S3Bucket", {
      removalPolicy: RemovalPolicy.DESTROY,
      objectOwnership: ObjectOwnership.BUCKET_OWNER_PREFERRED,
      blockPublicAccess: {
        blockPublicAcls: false,
        blockPublicPolicy: true,
        ignorePublicAcls: false,
        restrictPublicBuckets: true,
      },
      serverAccessLogsBucket: accessLogsBucket,
      serverAccessLogsPrefix: "access-logs",
    });

    const accessPoint = new CfnAccessPoint(this, "AccessPoint", {
      bucket: s3Bucket.bucketName,
      name: this.accessPointName,
      publicAccessBlockConfiguration: {
        ignorePublicAcls: false,
      },
    });

    const templatesPackageSourcePath = runPathRecipeSync(
      `[${this.templatesPackageName}]pkg.src`
    );
    const sourcePackage = Source.asset(`${templatesPackageSourcePath}/src`);

    const bucketDeployment = new BucketDeployment(this, "BucketDeployment", {
      sources: [sourcePackage],
      destinationBucket: s3Bucket,
      accessControl: BucketAccessControl.AUTHENTICATED_READ,
    });
  }
}
