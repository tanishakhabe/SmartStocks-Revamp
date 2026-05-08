// slider for the investment horizon question 4 of onboarding flow
// 1 year <--> 10+ years 
// you should only be able to move the slide by 1 year increments, and the max option should be 10+ years (so if you move the slider to 10, it should display 10+ years)
// the default placement of the slider should be in the middle at 5 years


// investment horizon is connected to p/e ratio

// # Mapping p/e ratio to investment horizon (1 year vs. 10 year slider)
// # high p/e ->  long (5-10 years), you have time for earnings to catch up to valuation
// # low p/e -> short (1-2 years), you need the stock to be cheap now

// pe_buckets = {
//     "short": features_raw_df["pe_ratio"].quantile(0.25),
//     "medium": features_raw_df["pe_ratio"].quantile(0.50), 
//     "long": features_raw_df["pe_ratio"].quantile(0.75),
// }

// def year_to_buckets(year):
//     if year <= 2:
//         return "short"
//     if year <= 5: 
//         return "medium"
//     return "long"
    

// def assign_pe_bucket_to_stocks(pe):
//     if pe <= features_raw_df["pe_ratio"].quantile(0.25):
//         return "short"
//     if pe <= features_raw_df["pe_ratio"].quantile(0.50):
//         return "medium"
//     return "long"

export const INVESTMENT_HORIZON = [
    {
        id: 1,
        label: '1 year',
        description: 'Short-term investment horizon, you need the stock to be cheap now.'
    },
    {
        id: 5,
        label: '5 years',
        description: 'Medium-term investment horizon.'
    },
    {
        id: 10,
        label: '10+ years',
        description: 'Long-term investment horizon, you have time for the earnings to catch up to valuation.'
    }
]   