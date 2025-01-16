import { Construct } from 'constructs';
import { Queue, QueueProps } from './index';
import { Token } from '../../core';
import { validateProps, ValidationRule } from '../../core/lib/helpers-internal';

function validateRange(value: number | undefined, minValue: number, maxValue: number): boolean {
  return value !== undefined && !Token.isUnresolved(value) && (value < minValue || value > maxValue);
}

const queueValidationRules: ValidationRule<QueueProps>[] = [
  {
    condition: (props) => validateRange(props.deliveryDelay?.toSeconds(), 0, 900),
    message: (props) => `delivery delay must be between 0 and 900 seconds, but ${props.deliveryDelay?.toSeconds()} was provided`,
  },
  {
    condition: (props) => validateRange(props.maxMessageSizeBytes, 1_024, 262_144),
    message: (props) => `maximum message size must be between 1,024 and 262,144 bytes, but ${props.maxMessageSizeBytes} was provided`,
  },
  {
    condition: (props) => validateRange(props.retentionPeriod?.toSeconds(), 60, 1_209_600),
    message: (props) => `message retention period must be between 60 and 1,209,600 seconds, but ${props.retentionPeriod?.toSeconds()} was provided`,
  },
  {
    condition: (props) => validateRange(props.receiveMessageWaitTime?.toSeconds(), 0, 20),
    message: (props) => `receive wait time must be between 0 and 20 seconds, but ${props.receiveMessageWaitTime?.toSeconds()} was provided`,
  },
  {
    condition: (props) => validateRange(props.visibilityTimeout?.toSeconds(), 0, 43_200),
    message: (props) => `visibility timeout must be between 0 and 43,200 seconds, but ${props.visibilityTimeout?.toSeconds()} was provided`,
  },
  {
    condition: (props) => validateRange(props.deadLetterQueue?.maxReceiveCount, 1, Number.MAX_SAFE_INTEGER),
    message: (props) => `dead letter target maximum receive count must be 1 or more, but ${props.deadLetterQueue?.maxReceiveCount} was provided`,
  },
];

export function validateQueueProps(scope: Construct, props: QueueProps) {
  validateProps(scope, Queue.name, props, queueValidationRules);
}
