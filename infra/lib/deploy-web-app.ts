import * as cdk from 'aws-cdk-lib';
import { Deployment } from 'aws-cdk-lib/aws-apigateway';
import { Construct } from 'constructs';
import { DeploymentService } from './deployment-service';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class DeployWebAppStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    // example resource
    // const queue = new sqs.Queue(this, 'InfraQueue', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });

    new DeploymentService(this, 'deployment');
  }
}
