import sinon from "sinon";

import loginAccount, {
  selectLoginAccount,
  __RewireAPI__ as loginAccountRewireAPI
} from "modules/auth/selectors/login-account";

import { formatRep, formatEther } from "utils/format-number";

describe(`modules/auth/selectors/login-account.js`, () => {
  describe("default", () => {
    test(`should call 'selectLoginAccount'`, done => {
      const stubbedSelectLoginAccount = sinon.stub();

      loginAccountRewireAPI.__Rewire__(
        "selectLoginAccount",
        stubbedSelectLoginAccount
      );

      loginAccount();

      loginAccountRewireAPI.__ResetDependency__("selectLoginAccount");

      assert(
        stubbedSelectLoginAccount.calledOnce,
        `didn't call 'selectLoginAccount' once as expected`
      );

      done();
    });
  });

  describe("selectLoginAccount", () => {
    // eslint-disable-line func-names, prefer-arrow-callback
    const stubbedGenerateDownloadAccountLink = sinon.stub();

    beforeAll(() => {
      loginAccountRewireAPI.__Rewire__(
        "generateDownloadAccountLink",
        stubbedGenerateDownloadAccountLink
      );
      loginAccountRewireAPI.__Rewire__("augur", {
        accounts: {
          account: {
            keystore: ""
          }
        }
      });
    });

    afterEach(() => {
      stubbedGenerateDownloadAccountLink.reset();
    });

    afterAll(() => {
      loginAccountRewireAPI.__ResetDependency__("generateDownloadAccountLink");
      loginAccountRewireAPI.__ResetDependency__("augur");
    });

    test(`should return the expected object when user is unlogged`, done => {
      const loginAccount = {};
      const accountName = null;

      const actual = selectLoginAccount.resultFunc(loginAccount, accountName);

      const expected = {
        accountName: null,
        rep: formatRep(undefined),
        eth: formatEther(undefined)
      };

      expect(actual).toEqual(expected);
      assert(
        stubbedGenerateDownloadAccountLink.calledOnce,
        `didn't call 'generateDownloadAccountLink' once as expected`
      );

      done();
    });

    test(`should return the expected object when user is logged via loginId with account locked`, done => {
      const loginAccount = {
        address: "0xAccountAddress",
        loginId: "123ThisIsALoginId",
        eth: "10",
        rep: "12"
      };
      const accountName = "testing";

      const actual = selectLoginAccount.resultFunc(loginAccount, accountName);

      const expected = {
        address: "0xAccountAddress",
        loginId: "123ThisIsALoginId",
        accountName: "testing",
        rep: formatRep(12, { zeroStyled: false, decimalsRounded: 4 }),
        eth: formatEther(10, { zeroStyled: false, decimalsRounded: 4 })
      };

      expect(actual).toEqual(expected);
      assert(
        stubbedGenerateDownloadAccountLink.calledOnce,
        `didn't call 'generateDownloadAccountLink' once as expected`
      );

      done();
    });

    test(`should return the expected object when user is logged via loginId with account locked and name encoded`, done => {
      const loginAccount = {
        address: "0xAccountAddress",
        loginId: "123ThisIsALoginId",
        eth: "10",
        rep: "12"
      };
      const accountName = "testing";

      const actual = selectLoginAccount.resultFunc(loginAccount, accountName);

      const expected = {
        address: "0xAccountAddress",
        loginId: "123ThisIsALoginId",
        accountName: "testing",
        rep: formatRep(12, { zeroStyled: false, decimalsRounded: 4 }),
        eth: formatEther(10, { zeroStyled: false, decimalsRounded: 4 })
      };

      expect(actual).toEqual(expected);
      assert(
        stubbedGenerateDownloadAccountLink.calledOnce,
        `didn't call 'generateDownloadAccountLink' once as expected`
      );

      done();
    });

    test(`should return the expected object when user is logged via loginId with account UNlocked`, done => {
      const loginAccount = {
        address: "0xAccountAddress",
        loginId: "123ThisIsALoginId",
        eth: "10",
        rep: "12",
        isUnlocked: true
      };
      const accountName = "testing";

      const actual = selectLoginAccount.resultFunc(loginAccount, accountName);

      const expected = {
        address: "0xAccountAddress",
        loginId: "123ThisIsALoginId",
        accountName: "testing",
        isUnlocked: true,
        rep: formatRep(12, { zeroStyled: false, decimalsRounded: 4 }),
        eth: formatEther(10, { zeroStyled: false, decimalsRounded: 4 })
      };

      expect(actual).toEqual(expected);
      assert(
        stubbedGenerateDownloadAccountLink.calledOnce,
        `didn't call 'generateDownloadAccountLink' once as expected`
      );

      done();
    });

    test(`should return the expected object when user is logged via Edge`, done => {
      const loginAccount = {
        edgeAccount: {},
        address: "0xAccountAddress",
        loginId: "123ThisIsALoginId",
        eth: "10",
        rep: "12",
        isUnlocked: true
      };
      const accountName = "testing";

      const actual = selectLoginAccount.resultFunc(loginAccount, accountName);

      const expected = {
        edgeAccount: {},
        address: "0xAccountAddress",
        loginId: "123ThisIsALoginId",
        accountName: "testing",
        isUnlocked: true,
        rep: formatRep(12, { zeroStyled: false, decimalsRounded: 4 }),
        eth: formatEther(10, { zeroStyled: false, decimalsRounded: 4 })
      };

      expect(actual).toEqual(expected);
      assert(
        stubbedGenerateDownloadAccountLink.calledOnce,
        `didn't call 'generateDownloadAccountLink' once as expected`
      );

      done();
    });
  });
});
