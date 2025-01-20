import { aws_cloudfront, aws_cloudfront_origins, aws_s3, aws_s3_deployment, CfnOutput, RemovalPolicy } from "aws-cdk-lib";
import { Construct } from "constructs";

const webappPath = './resources/webapp';

export class DeploymentService extends Construct {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    // The code that defines your construct goes here
    const hostingBucket = new aws_s3.Bucket(this, 'FrontendBucket', {
        blockPublicAccess: aws_s3.BlockPublicAccess.BLOCK_ALL,
        autoDeleteObjects: true,
        removalPolicy: RemovalPolicy.DESTROY,
    });

    const distribution = new aws_cloudfront.Distribution(this, 'CloudfrontDistribution', {
        defaultBehavior: { 
            origin: new aws_cloudfront_origins.S3Origin(hostingBucket),
            viewerProtocolPolicy: aws_cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
         },
        defaultRootObject: 'index.html',
        errorResponses: [
            {
                httpStatus: 404,
                responseHttpStatus: 200,
                responsePagePath: '/index.html',
            },
        ],
    });

    const FrontendDeployment = new aws_s3_deployment.BucketDeployment(this, 'FrontEndDeployment', {
        sources: [aws_s3_deployment.Source.asset(webappPath)],
        destinationBucket: hostingBucket,
        distribution,
        distributionPaths: ['/*'],
    });

    new CfnOutput(this, 'CloudFrontURL', {
        value: distribution.domainName,
        description: 'The CloudFront distribution URL',
        exportName: 'CloudFrontURL',
    });

    new CfnOutput(this, 'FrontendBucketURL', {
        value: hostingBucket.bucketWebsiteUrl,
        description: 'The Frontend bucket URL',
        exportName: 'FrontendBucketURL',
    });

    new CfnOutput(this, 'FrontendBucketName', {
        value: hostingBucket.bucketName,
        description: 'The Frontend bucket name',
        exportName: 'FrontendBucketName',
    });

  }
}