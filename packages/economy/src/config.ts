import { load as toml } from "js-toml";
import fs from "node:fs";
import path from "node:path";

export class Config {

    static DEFAULT = `
# |||                                                  |||
# |||       Configuration for @crossfish/economy       |||
# ||| https://www.npmjs.com/package/@crossfish/economy |||
# |||                                                  |||
# ***  Using TOML 1.0.0 >>> https://toml.io/en/v1.0.0  ***



[database]

# The full database URL or filepath.
# Filepaths are relative to the working directory (process.cwd).
# Provided SQLite paths will be created if not already existent.
# See https://sequelize.org/master/manual/getting-started.html#connecting-to-a-database
# for more information.
url = "/crossfish.eco.sqlite"

# The database logging level.
# See https://sequelize.org/master/manual/getting-started.html#logging
# for more information.
logging = "error"



[balance]

# The amount of currency that new balances should start with by default.
# Supports different values for different custom currencies (including default currency "main").
starting.main = 50
# starting.points = 25
# starting.tokens = 0

# The minimum amount of currency that a balance can drop to (zero by default).
min.main = 0

# The maximum amount of currency that a balance can reach (1 trillion by default).
max.main = 1_000_000_000_000

# The symbol associated with a balance currency.
symbol.main = "$"



[balance.donate]

# Whether to enable direct donation between different balances.
enabled.main = true

# The minimum amount of currency that can be donated from a balance.
min.main = 10

# The maximum amount of currency that can be donated from a balance.
max.main = 500_000_000_000

# The tax rate to deduct from donations.
# The deducted tax amount is added to the central bank's balance, if enabled.
tax.main = 0.1



[balance.bet]

# Whether to enable directly betting from a balance.
enabled.main = true

# The minimum amount of currency that can be donated from a balance.
min.main = 10

# The maximum amount of currency that can be donated from a balance.
max.main = 1_000_000_000

# The factor by which the bet amount is multiplied upon winning.
# x2 by default (e.g. bet $50, win $100)
win_rate.main = 2

# The factor by which the bet amount is multiplied upon losing.
# x1 by default (e.g. bet $50, lose $50)
loss_rate.main = 1



[bank]

# Whether banking is enabled for a currency.
enabled.main = true

# The interest rate to apply to account balances.
# Defaults to 0.4% with daily frequency.
# A two-item array may also be provided for a range of rates.
interest.main = 0.004
# interest.euros = [ 0.001, 0.009 ]

# The frequency at which to apply the interest rate.
# Presets include: hourly, daily, weekly, monthly, yearly, never.
# * You may also provide cron syntax, see https://github.com/node-cron/node-cron#cron-syntax
# * for more information.
frequency.main = "daily"

# The maximum balance that a bank account can reach.
# By default, an individual can have:
# - 1 trillion main currency in personal balance
# - 2 trillion main currency in bank balance
# + Total: 3 trillion main currency maximum
max.main = 2_000_000_000_000

# The period after which a bond purchased from the bank will mature.
# Setting this to 'never' will disable bonds altogether.
# By default, bonds will mature after 1 month.
# Presets include: hour, day, week, month, year, never.
# * You may also provide cron syntax, see https://github.com/node-cron/node-cron#cron-syntax
# * for more information.
bond_maturity.main = "0 * * */1 *"



[bank.deposit]

# Whether deposits are enabled for a currency.
enabled.main = true

# The minimum amount that can be deposited into a bank account at once (1000 by default).
min.main = 1000

# The maximum amount that can be deposited into a bank account at once (100 billion by default).
max.main = 100_000_000_000



[bank.withdraw]

# Whether withdrawals are enabled for a currency.
enabled.main = true

# The minimum amount that can be withdrawn from a bank account at once (1000 by default).
min.main = 1000

# The maximum amount that can be withdrawn from a bank account at once (100 billion by default).
max.main = 100_000_000_000



[bank.loan]

# Whether loans are enabled for a currency.
enabled.main = true

# The minimum amount that can be given in a single loan (1000 by default).
min.main = 1000

# The maximum amount that can be given in a single loan (10 million by default).
# Note that the individual usually needs to have at least half the loan amount to get the loan.
# For example: for a loan of $10,000,000 one needs to already have at least $5,000,000 
max.main = 10_000_000

# The interest rate to apply to loans.
# Defaults to 10% with weekly frequency.
# * A two-item array may also be provided for a range of rates.
interest.main = 0.1
# interest.euros = [ 0.09, 0.11 ]

# The frequency at which to apply the interest rate.
# Presets include: hourly, daily, weekly, monthly, yearly, never.
# * You may also provide cron syntax, see https://github.com/node-cron/node-cron#cron-syntax
# * for more information.
frequency.main = "weekly"

# The number of loans that can be taken out concurrently.
number.main = 1



[bank.transfer]

# Whether transfers are enabled for a currency.
enabled.main = true

# The minimum amount that can be moved in a single transfer (1000 by default).
min.main = 1000

# The maximum amount that can be moved in a single transfer (1 million by default).
max.main = 1_000_000

# The tax rate to deduct from transfers.
# The deducted tax amount is added to the central bank's balance, if enabled.
# Disabled by default.
tax.main = 0



[bank.central]
# Central banks hold large sums of borrowable money for a guild or globally.
# When enabled - loans and withdrawals are taken from / deposits, taxes, and bills are given to - the central bank's balance.
# When disabled - loans, withdrawals, deposits, taxes, and bills - only affect an individual's personal and bank account balances.

# Whether the central bank is enabled for a currency.
enabled.main = true

# The starting balance of the central bank (100 thousand by default).
# * You may also set this to infinity to prevent the central bank's balance from ever decreasing.
balance.main = 100_000
# balance.main = inf

# Whether the central bank should invest in the Stock Market.
# When enabled, the central bank's balance will passively increase over time.
stocks.main = true

# The maximum balance that the central bank can reach.
# * The default is 9 quadrillion, a little under the max safe integer value.
# * It is not recommended to set a number higher than the default.
max.main = 9_000_000_000_000_000

# Regularly replenishes the central bank balance to a minimum of its starting balance, if necessary.
# By default, replenishment is disabled. If the starting balance is infinite, this is automatically disabled.
# Presets include: hourly, daily, weekly, monthly, yearly, never.
# * You may also provide cron syntax, see https://github.com/node-cron/node-cron#cron-syntax
# * for more information.
replenish.main = "never"

`.trim();

    static eco: { [key: string]: any };

    static load() : void {
        let file: string;
        const fp = path.join(process.cwd(), 'cf.eco.toml');
        
        if (fs.existsSync(fp)) file = fs.readFileSync(fp, 'utf8');
        else { fs.writeFileSync(fp, Config.DEFAULT); return this.load(); }

        this.eco = toml(file);
    }

}