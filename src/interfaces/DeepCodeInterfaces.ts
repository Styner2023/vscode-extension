import {
  ExtensionContext,
  DiagnosticCollection,
  StatusBarItem,
  WorkspaceFolder,
  TextDocument,
  TextEditor,
} from 'vscode';
import * as vscode from 'vscode';

import { IServiceAI, IHashesBundles, IRemoteBundlesCollection, IRemoteBundle } from '@deepcode/tsc';

export interface StatusBarItemInterface {
  deepcodeStatusBarItem: StatusBarItem;
  show(): void;
}

export interface BaseDeepCodeModuleInterface {
  serviceAI: IServiceAI;
  currentWorkspacePath: string;
  workspacesPaths: Array<string>;
  hashesBundles: IHashesBundles;
  remoteBundles: IRemoteBundlesCollection;
  refreshViewEmitter: vscode.EventEmitter<any>;
  refreshViews(content: any): void;
  analysisStatus: string;
  analysisProgress: number;
  source: string;
  staticToken: string;
  defaultBaseURL: string;
  staticBaseURL: string;
  baseURL: string;
  termsConditionsUrl: string;
  token: string;
  setToken(token: string): Promise<void>;
  uploadApproved: boolean;
  shouldReportErrors: boolean;
  shouldReportEvents: boolean;
  setUploadApproved(value: boolean): Promise<void>;
  analyzer: AnalyzerInterface;
  statusBarItem: StatusBarItemInterface;
  filesWatcher: DeepCodeWatcherInterface;
  workspacesWatcher: DeepCodeWatcherInterface;
  settingsWatcher: DeepCodeWatcherInterface;
  setLoadingBadge(value: boolean): Promise<void>;
  setContext(key: string, value: unknown): Promise<void>;
  shouldShowAnalysis: boolean;
  emitViewInitialized(): void;

  // Abstract methods
  processError(error: errorType, options?: { [key: string]: any }): Promise<void>;
  processEvent(event: string, options: { [key: string]: any }): Promise<void>;
  startExtension(): Promise<void>;
}

export interface ReportModuleInterface {
  resetTransientErrors(): void;
  trackViewSuggestion(issueId: string, severity: number): Promise<void>;
}

export interface LoginModuleInterface {
  initiateLogin(): Promise<void>;
  checkSession(): Promise<boolean>;
  approveUpload(): Promise<void>;
  checkApproval(): Promise<boolean>;
  checkWelcomeNotification(): Promise<void>;
  checkAdvancedMode(): Promise<void>;
}

export interface BundlesModuleInterface {
  readonly runningAnalysis: boolean;
  startAnalysis(): Promise<void>;
  createWorkspacesList(workspaces: WorkspaceFolder[]): void;
  changeWorkspaceList(workspacePath: string, deleteAddFlag?: boolean): void;
  updateCurrentWorkspacePath(newWorkspacePath: string): void;
  updateHashesBundles(workspacePath?: string, deleteAddFlag?: boolean): Promise<void>;
  performBundlesActions(path: string): Promise<void>;
  updateExtensionRemoteBundles(workspacePath: string, bundle?: IRemoteBundle): Promise<void>;
  checkIfHashesBundlesIsEmpty(bundlePath?: string): boolean;
  checkIfRemoteBundlesIsEmpty(bundlePath?: string): boolean;
}

export interface DeepCodeLibInterface {
  activateAll(): void;
  setMode(mode: string): void;
}

export interface ExtensionInterface
  extends BaseDeepCodeModuleInterface,
    ReportModuleInterface,
    LoginModuleInterface,
    BundlesModuleInterface,
    DeepCodeLibInterface {
  activate(context: ExtensionContext): void;
}

export interface DeepCodeWatcherInterface {
  activate(extension: ExtensionInterface | any): void;
}

export type userStateItemType = string | number | boolean | undefined;

export type configType = string | Function;

export type errorType = Error | any;

export type filesForSaveListType = Array<string>;

export type openedTextEditorType = {
  fullPath: string;
  workspace: string;
  filePathInWorkspace: string;
  lineCount: {
    current: number;
    prevOffset: number;
  };
  contentChanges: Array<any>;
  document: TextDocument;
};

export type analysisSuggestionsType = {
  id: string;
  message: string;
  severity: number;
};

export interface StateIitemsInterface {
  [key: string]: string;
}

export interface StateSelectorsInterface {
  [key: string]: Function;
}

export interface SingleIssuePositionInterface {
  cols: Array<number>;
  rows: Array<number>;
}

export interface IssueMarkersInterface {
  msg: Array<number>;
  pos: Array<SingleIssuePositionInterface>;
}

export interface IssuePositionsInterface extends SingleIssuePositionInterface {
  markers?: Array<IssueMarkersInterface>;
}

export interface AnalysisResultsFileResultsInterface {
  [suggestionIndex: string]: Array<IssuePositionsInterface>;
}

export interface AnalysisResultsFilesInterface {
  files: {
    [filePath: string]: AnalysisResultsFileResultsInterface;
  };
}

export interface AnalysisSuggestionsInterface {
  [suggestionIndex: number]: analysisSuggestionsType;
}

export interface AnalysisServerResultsInterface extends AnalysisResultsFilesInterface {
  suggestions: AnalysisSuggestionsInterface;
}

export interface AnalysisResultsInterface extends AnalysisServerResultsInterface {
  success: boolean;
}

export interface AnalysisServerResponseInterface {
  status: string;
  progress: number;
  analysisURL: string;
  analysisResults?: AnalysisServerResultsInterface;
}

export interface AnalysisResultsCollectionInterface {
  [key: string]: AnalysisResultsInterface;
}

export interface IssuesListInterface {
  [suggestionIndex: number]: Array<IssuePositionsInterface>;
}
export interface IssuesListOptionsInterface {
  fileIssuesList: IssuesListInterface;
  suggestions: AnalysisSuggestionsInterface;
  fileUri: vscode.Uri;
}

export interface AnalyzerInterface {
  activate(extension: ExtensionInterface | any): void;
  deepcodeReview: DiagnosticCollection | undefined;
  analysisResultsCollection: AnalysisResultsCollectionInterface;
  findSuggestionId(suggestionName: string, filePath: string): string;
  removeReviewResults(workspacePath: string): Promise<void>;
  createReviewResults(): Promise<void>;
  updateReviewResultsPositions(extension: ExtensionInterface, updatedFile: openedTextEditorType): Promise<void>;
  configureIssuesDisplayBySeverity(severity: number, hide: boolean): Promise<void>;
  setIssuesMarkersDecoration(editor: TextEditor | undefined): void;
  updateAnalysisResultsCollection(results: AnalysisResultsCollectionInterface, rootPath: string): void;
}
