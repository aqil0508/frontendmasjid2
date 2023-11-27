module.exports = {
    "env": {
        "browser": true,
        "es2021": true,

    
    },
    "extends": [
        "eslint:recommended",
        'plugin:react/jsx-runtime',
        'plugin:react/recommended',
        'plugin:prettier/recommended',
        
    ],
   
    "overrides": [
        {
            "env": {
                "node": true
            },
            "files": [
                ".eslintrc.{js,cjs}"
            ],
        }
    ],
    "parserOptions": {
        "ecmaVersion": "latest",
        "sourceType": "module"
    },
    "plugins": [
        "react",
        "import"
    ],
    "rules": {
        
        "no-console": "off",
        "prettier/prettier": [
            "error",
            {
              "endOfLine": "auto",
              "singleQuote": true,
              "parser": "flow"
            }
          ],
        "react/jsx-uses-react": "off",   
        "react/jsx-uses-vars": "off",
        "no-unused-vars": [
            "off",
            {
                "varsIgnorePattern": "React"
            }
        ]
    }
}
