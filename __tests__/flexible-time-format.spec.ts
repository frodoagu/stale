import {Issue} from '../src/classes/issue';
import {IIssuesProcessorOptions} from '../src/interfaces/issues-processor-options';
import {IsoDateString} from '../src/types/iso-date-string';
import {IssuesProcessorMock} from './classes/issues-processor-mock';
import {DefaultProcessorOptions} from './constants/default-processor-options';
import {generateIssue} from './functions/generate-issue';
import {alwaysFalseStateMock} from './classes/state-mock';

describe('flexible time format', (): void => {
  let sut: SUT;

  beforeEach((): void => {
    sut = new SUT();
  });

  describe('when using hours format', (): void => {
    it('should process an issue that is 4 hours old with stale time set to "2h"', async (): Promise<void> => {
      expect.assertions(2);
      
      const opts: IIssuesProcessorOptions = {
        ...DefaultProcessorOptions,
        timeBeforeStale: 2 / 24, // 2 hours in days
        staleIssueMessage: 'This issue is stale'
      };
      
      // Create an issue that was created 4 hours ago
      const issueDate = new Date();
      issueDate.setHours(issueDate.getHours() - 4);
      
      const TestIssueList: Issue[] = [
        generateIssue(opts, 1, 'An issue', issueDate.toISOString())
      ];
      
      const processor = new IssuesProcessorMock(
        opts,
        alwaysFalseStateMock,
        async p => (p === 1 ? TestIssueList : []),
        async () => [],
        async () => new Date().toISOString()
      );

      await processor.processIssues(1);

      expect(processor.staleIssues).toHaveLength(1);
      expect(processor.closedIssues).toHaveLength(0);
    });

    it('should not mark as stale an issue that is 1 hour old with stale time set to "2h"', async (): Promise<void> => {
      expect.assertions(2);
      
      const opts: IIssuesProcessorOptions = {
        ...DefaultProcessorOptions,
        timeBeforeStale: 2 / 24, // 2 hours in days
        staleIssueMessage: 'This issue is stale'
      };
      
      // Create an issue that was created 1 hour ago
      const issueDate = new Date();
      issueDate.setHours(issueDate.getHours() - 1);
      
      const TestIssueList: Issue[] = [
        generateIssue(opts, 1, 'An issue', issueDate.toISOString())
      ];
      
      const processor = new IssuesProcessorMock(
        opts,
        alwaysFalseStateMock,
        async p => (p === 1 ? TestIssueList : []),
        async () => [],
        async () => new Date().toISOString()
      );

      await processor.processIssues(1);

      expect(processor.staleIssues).toHaveLength(0);
      expect(processor.closedIssues).toHaveLength(0);
    });
  });

  describe('when using minutes format', (): void => {
    it('should process an issue that is 2 hours old with stale time set to "60m"', async (): Promise<void> => {
      expect.assertions(2);
      
      const opts: IIssuesProcessorOptions = {
        ...DefaultProcessorOptions,
        timeBeforeStale: 60 / (24 * 60), // 60 minutes in days
        staleIssueMessage: 'This issue is stale'
      };
      
      // Create an issue that was created 2 hours ago (120 minutes)
      const issueDate = new Date();
      issueDate.setHours(issueDate.getHours() - 2);
      
      const TestIssueList: Issue[] = [
        generateIssue(opts, 1, 'An issue', issueDate.toISOString())
      ];
      
      const processor = new IssuesProcessorMock(
        opts,
        alwaysFalseStateMock,
        async p => (p === 1 ? TestIssueList : []),
        async () => [],
        async () => new Date().toISOString()
      );

      await processor.processIssues(1);

      expect(processor.staleIssues).toHaveLength(1);
      expect(processor.closedIssues).toHaveLength(0);
    });
  });

  describe('when using mixed time formats', (): void => {
    it('should process an issue that is 25 hours old with stale time set to "1d"', async (): Promise<void> => {
      expect.assertions(2);
      
      const opts: IIssuesProcessorOptions = {
        ...DefaultProcessorOptions,
        timeBeforeStale: 1, // 1 day
        staleIssueMessage: 'This issue is stale'
      };
      
      // Create an issue that was created 25 hours ago
      const issueDate = new Date();
      issueDate.setHours(issueDate.getHours() - 25);
      
      const TestIssueList: Issue[] = [
        generateIssue(opts, 1, 'An issue', issueDate.toISOString())
      ];
      
      const processor = new IssuesProcessorMock(
        opts,
        alwaysFalseStateMock,
        async p => (p === 1 ? TestIssueList : []),
        async () => [],
        async () => new Date().toISOString()
      );

      await processor.processIssues(1);

      expect(processor.staleIssues).toHaveLength(1);
      expect(processor.closedIssues).toHaveLength(0);
    });
  });

  describe('when using fractional time', (): void => {
    it('should handle fractional hours correctly', async (): Promise<void> => {
      expect.assertions(2);
      
      const opts: IIssuesProcessorOptions = {
        ...DefaultProcessorOptions,
        timeBeforeStale: 1.5 / 24, // 1.5 hours in days
        staleIssueMessage: 'This issue is stale'
      };
      
      // Create an issue that was created 2 hours ago
      const issueDate = new Date();
      issueDate.setHours(issueDate.getHours() - 2);
      
      const TestIssueList: Issue[] = [
        generateIssue(opts, 1, 'An issue', issueDate.toISOString())
      ];
      
      const processor = new IssuesProcessorMock(
        opts,
        alwaysFalseStateMock,
        async p => (p === 1 ? TestIssueList : []),
        async () => [],
        async () => new Date().toISOString()
      );

      await processor.processIssues(1);

      expect(processor.staleIssues).toHaveLength(1);
      expect(processor.closedIssues).toHaveLength(0);
    });
  });
});

class SUT {
  processor!: IssuesProcessorMock;
  private _opts: IIssuesProcessorOptions = {...DefaultProcessorOptions};
  private _testIssueList: Issue[] = [];

  newIssue(): SUTIssue {
    const sutIssue: SUTIssue = new SUTIssue();
    return sutIssue;
  }

  staleIn(time: number): SUT {
    this._updateOptions({
      timeBeforeStale: time
    });

    return this;
  }

  async test(): Promise<number> {
    return this._setTestIssueList()._setProcessor();
  }

  private _updateOptions(opts: Partial<IIssuesProcessorOptions>): SUT {
    this._opts = {...this._opts, ...opts};

    return this;
  }

  private _setTestIssueList(): SUT {
    return this;
  }

  private async _setProcessor(): Promise<number> {
    this.processor = new IssuesProcessorMock(
      this._opts,
      alwaysFalseStateMock,
      async p => (p === 1 ? this._testIssueList : []),
      async () => [],
      async () => new Date().toISOString()
    );

    await this.processor.processIssues(1);

    return this.processor.operations.getConsumedOperationsCount();
  }
}

class SUTIssue {
  private _createdAt: IsoDateString = '2020-01-01T17:00:00Z';
  private _updatedAt: IsoDateString = '2020-01-01T17:00:00Z';

  created(daysAgo: number): SUTIssue {
    const today = new Date();
    today.setDate(today.getDate() - daysAgo);
    this._createdAt = today.toISOString();

    return this;
  }

  updated(daysAgo: number): SUTIssue {
    const today = new Date();
    today.setDate(today.getDate() - daysAgo);
    this._updatedAt = today.toISOString();

    return this;
  }

  toIssue(options: IIssuesProcessorOptions): Issue {
    return generateIssue(
      options,
      1,
      'A test issue',
      this._updatedAt,
      this._createdAt
    );
  }
}