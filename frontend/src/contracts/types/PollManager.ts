/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumberish,
  BytesLike,
  FunctionFragment,
  Result,
  Interface,
  EventFragment,
  AddressLike,
  ContractRunner,
  ContractMethod,
  Listener,
} from "ethers";
import type {
  TypedContractEvent,
  TypedDeferredTopicFilter,
  TypedEventLog,
  TypedLogDescription,
  TypedListener,
  TypedContractMethod,
} from "./common";

export declare namespace PollManager {
  export type OptionStruct = { name: string; voteCount: BigNumberish };

  export type OptionStructOutput = [name: string, voteCount: bigint] & {
    name: string;
    voteCount: bigint;
  };

  export type PollStruct = {
    id: BigNumberish;
    creator: AddressLike;
    question: string;
    options: PollManager.OptionStruct[];
    isActive: boolean;
    numParticipants: BigNumberish;
  };

  export type PollStructOutput = [
    id: bigint,
    creator: string,
    question: string,
    options: PollManager.OptionStructOutput[],
    isActive: boolean,
    numParticipants: bigint
  ] & {
    id: bigint;
    creator: string;
    question: string;
    options: PollManager.OptionStructOutput[];
    isActive: boolean;
    numParticipants: bigint;
  };
}

export interface PollManagerInterface extends Interface {
  getFunction(
    nameOrSignature:
      | "closePoll"
      | "createPoll"
      | "getPoll"
      | "getPolls"
      | "hasVoted"
      | "numPolls"
      | "vote"
  ): FunctionFragment;

  getEvent(
    nameOrSignatureOrTopic: "PollClosed" | "PollCreated" | "VoteRegistered"
  ): EventFragment;

  encodeFunctionData(
    functionFragment: "closePoll",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "createPoll",
    values: [string, string[]]
  ): string;
  encodeFunctionData(
    functionFragment: "getPoll",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "getPolls", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "hasVoted",
    values: [AddressLike, BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "numPolls", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "vote",
    values: [BigNumberish, BigNumberish]
  ): string;

  decodeFunctionResult(functionFragment: "closePoll", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "createPoll", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "getPoll", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "getPolls", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "hasVoted", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "numPolls", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "vote", data: BytesLike): Result;
}

export namespace PollClosedEvent {
  export type InputTuple = [pollId: BigNumberish, pollCreator: AddressLike];
  export type OutputTuple = [pollId: bigint, pollCreator: string];
  export interface OutputObject {
    pollId: bigint;
    pollCreator: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace PollCreatedEvent {
  export type InputTuple = [pollId: BigNumberish, pollCreator: AddressLike];
  export type OutputTuple = [pollId: bigint, pollCreator: string];
  export interface OutputObject {
    pollId: bigint;
    pollCreator: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace VoteRegisteredEvent {
  export type InputTuple = [
    pollId: BigNumberish,
    pollCreator: AddressLike,
    voter: AddressLike,
    optionId: BigNumberish,
    optionName: string
  ];
  export type OutputTuple = [
    pollId: bigint,
    pollCreator: string,
    voter: string,
    optionId: bigint,
    optionName: string
  ];
  export interface OutputObject {
    pollId: bigint;
    pollCreator: string;
    voter: string;
    optionId: bigint;
    optionName: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export interface PollManager extends BaseContract {
  connect(runner?: ContractRunner | null): PollManager;
  waitForDeployment(): Promise<this>;

  interface: PollManagerInterface;

  queryFilter<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEventLog<TCEvent>>>;
  queryFilter<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEventLog<TCEvent>>>;

  on<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    listener: TypedListener<TCEvent>
  ): Promise<this>;
  on<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>
  ): Promise<this>;

  once<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    listener: TypedListener<TCEvent>
  ): Promise<this>;
  once<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>
  ): Promise<this>;

  listeners<TCEvent extends TypedContractEvent>(
    event: TCEvent
  ): Promise<Array<TypedListener<TCEvent>>>;
  listeners(eventName?: string): Promise<Array<Listener>>;
  removeAllListeners<TCEvent extends TypedContractEvent>(
    event?: TCEvent
  ): Promise<this>;

  closePoll: TypedContractMethod<[pollId: BigNumberish], [void], "nonpayable">;

  createPoll: TypedContractMethod<
    [question: string, optionNames: string[]],
    [void],
    "nonpayable"
  >;

  getPoll: TypedContractMethod<
    [pollId: BigNumberish],
    [PollManager.PollStructOutput],
    "view"
  >;

  getPolls: TypedContractMethod<[], [PollManager.PollStructOutput[]], "view">;

  hasVoted: TypedContractMethod<
    [voterAddress: AddressLike, pollId: BigNumberish],
    [boolean],
    "view"
  >;

  numPolls: TypedContractMethod<[], [bigint], "view">;

  vote: TypedContractMethod<
    [pollId: BigNumberish, optionId: BigNumberish],
    [void],
    "nonpayable"
  >;

  getFunction<T extends ContractMethod = ContractMethod>(
    key: string | FunctionFragment
  ): T;

  getFunction(
    nameOrSignature: "closePoll"
  ): TypedContractMethod<[pollId: BigNumberish], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "createPoll"
  ): TypedContractMethod<
    [question: string, optionNames: string[]],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "getPoll"
  ): TypedContractMethod<
    [pollId: BigNumberish],
    [PollManager.PollStructOutput],
    "view"
  >;
  getFunction(
    nameOrSignature: "getPolls"
  ): TypedContractMethod<[], [PollManager.PollStructOutput[]], "view">;
  getFunction(
    nameOrSignature: "hasVoted"
  ): TypedContractMethod<
    [voterAddress: AddressLike, pollId: BigNumberish],
    [boolean],
    "view"
  >;
  getFunction(
    nameOrSignature: "numPolls"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "vote"
  ): TypedContractMethod<
    [pollId: BigNumberish, optionId: BigNumberish],
    [void],
    "nonpayable"
  >;

  getEvent(
    key: "PollClosed"
  ): TypedContractEvent<
    PollClosedEvent.InputTuple,
    PollClosedEvent.OutputTuple,
    PollClosedEvent.OutputObject
  >;
  getEvent(
    key: "PollCreated"
  ): TypedContractEvent<
    PollCreatedEvent.InputTuple,
    PollCreatedEvent.OutputTuple,
    PollCreatedEvent.OutputObject
  >;
  getEvent(
    key: "VoteRegistered"
  ): TypedContractEvent<
    VoteRegisteredEvent.InputTuple,
    VoteRegisteredEvent.OutputTuple,
    VoteRegisteredEvent.OutputObject
  >;

  filters: {
    "PollClosed(uint256,address)": TypedContractEvent<
      PollClosedEvent.InputTuple,
      PollClosedEvent.OutputTuple,
      PollClosedEvent.OutputObject
    >;
    PollClosed: TypedContractEvent<
      PollClosedEvent.InputTuple,
      PollClosedEvent.OutputTuple,
      PollClosedEvent.OutputObject
    >;

    "PollCreated(uint256,address)": TypedContractEvent<
      PollCreatedEvent.InputTuple,
      PollCreatedEvent.OutputTuple,
      PollCreatedEvent.OutputObject
    >;
    PollCreated: TypedContractEvent<
      PollCreatedEvent.InputTuple,
      PollCreatedEvent.OutputTuple,
      PollCreatedEvent.OutputObject
    >;

    "VoteRegistered(uint256,address,address,uint256,string)": TypedContractEvent<
      VoteRegisteredEvent.InputTuple,
      VoteRegisteredEvent.OutputTuple,
      VoteRegisteredEvent.OutputObject
    >;
    VoteRegistered: TypedContractEvent<
      VoteRegisteredEvent.InputTuple,
      VoteRegisteredEvent.OutputTuple,
      VoteRegisteredEvent.OutputObject
    >;
  };
}
