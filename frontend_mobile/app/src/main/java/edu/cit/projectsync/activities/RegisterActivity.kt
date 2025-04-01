package edu.cit.projectsync.activities

import android.app.Activity
import android.content.Intent
import android.os.Bundle
import android.text.Editable
import android.text.TextWatcher
import android.view.LayoutInflater
import android.view.View
import android.widget.*
import edu.cit.projectsync.R

class RegisterActivity : Activity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_register) // Assuming your register layout is named activity_register.xml

        val edittext_firstname = findViewById<EditText>(R.id.fNameInput)
        val edittext_lastname = findViewById<EditText>(R.id.lnameInput)
        val edittext_email = findViewById<EditText>(R.id.emailRegisterInput)
        val edittext_password = findViewById<EditText>(R.id.passwordInput)
        val edittext_confirmpassword = findViewById<EditText>(R.id.confirmPasswordInput)
        val checkbox_agree = findViewById<CheckBox>(R.id.AgreeBox)

        // Create the password requirements popup
        val popupWindow = createPasswordRequirementsPopup()

        // Show the popup when the password field is focused
        edittext_password.setOnFocusChangeListener { _, hasFocus ->
            if (hasFocus) {
                popupWindow.showAsDropDown(edittext_password)
            } else {
                popupWindow.dismiss()
            }
        }

        // Add a TextWatcher to dynamically update the popup
        edittext_password.addTextChangedListener(object : TextWatcher {
            override fun beforeTextChanged(s: CharSequence?, start: Int, count: Int, after: Int) {}

            override fun onTextChanged(s: CharSequence?, start: Int, before: Int, count: Int) {
                val password = s.toString()
                updatePasswordRequirementsPopup(popupWindow.contentView, password)
            }

            override fun afterTextChanged(s: Editable?) {}
        })

        val button_register = findViewById<Button>(R.id.registerButton)
        button_register.setOnClickListener {
            val fname = edittext_firstname.text.toString().trim()
            val lname = edittext_lastname.text.toString().trim()
            val email = edittext_email.text.toString().trim()
            val password = edittext_password.text.toString()
            val confirmpassword = edittext_confirmpassword.text.toString()

            // Check if any field is empty
            if (fname.isEmpty() || lname.isEmpty() || email.isEmpty() || password.isEmpty() || confirmpassword.isEmpty()) {
                Toast.makeText(this, "All fields must not be empty", Toast.LENGTH_LONG).show()
                return@setOnClickListener
            }

            // Check if passwords match
            if (password != confirmpassword) {
                Toast.makeText(this, "Passwords do not match", Toast.LENGTH_LONG).show()
                return@setOnClickListener
            }

            // Validate password strength
            if (!isPasswordLengthValid(password)) {
                Toast.makeText(this, "Password must be at least 8 characters long", Toast.LENGTH_LONG).show()
                return@setOnClickListener
            }

            if (!containsUppercase(password)) {
                Toast.makeText(this, "Password must contain at least one uppercase letter", Toast.LENGTH_LONG).show()
                return@setOnClickListener
            }

            if (!containsLowercase(password)) {
                Toast.makeText(this, "Password must contain at least one lowercase letter", Toast.LENGTH_LONG).show()
                return@setOnClickListener
            }

            if (!containsDigit(password)) {
                Toast.makeText(this, "Password must contain at least one digit", Toast.LENGTH_LONG).show()
                return@setOnClickListener
            }

            if (containsSpecialCharacters(password)) {
                Toast.makeText(this, "Password must not contain special characters", Toast.LENGTH_LONG).show()
                return@setOnClickListener
            }

            // Check if the checkbox is checked
            if (!checkbox_agree.isChecked) {
                Toast.makeText(this, "You must agree to the terms and conditions", Toast.LENGTH_LONG).show()
                return@setOnClickListener
            }

            // If all validations pass
            Toast.makeText(this, "Registration successful!", Toast.LENGTH_LONG).show()
        }

        val button_login = findViewById<TextView>(R.id.loginButton)
        button_login.setOnClickListener {
            val intent = Intent(this, LoginActivity::class.java)
            startActivity(intent)
        }
    }

    // Create the PopupWindow for password requirements
    private fun createPasswordRequirementsPopup(): PopupWindow {
        val inflater = LayoutInflater.from(this)
        val popupView = inflater.inflate(R.layout.password_requirements_modal, null)

        val popupWindow = PopupWindow(
            popupView,
            LinearLayout.LayoutParams.WRAP_CONTENT,
            LinearLayout.LayoutParams.WRAP_CONTENT,
            true
        )

        // Allow interaction with the EditText while the popup is displayed
        popupWindow.isFocusable = false
        popupWindow.isTouchable = true
        popupWindow.isOutsideTouchable = false
        popupWindow.inputMethodMode = PopupWindow.INPUT_METHOD_NEEDED

        return popupWindow
    }

    // Update the password requirements dynamically
    private fun updatePasswordRequirementsPopup(view: View, password: String) {
        val lengthRequirement = view.findViewById<TextView>(R.id.requirement_length)
        val uppercaseRequirement = view.findViewById<TextView>(R.id.requirement_uppercase)
        val lowercaseRequirement = view.findViewById<TextView>(R.id.requirement_lowercase)
        val digitRequirement = view.findViewById<TextView>(R.id.requirement_digit)
        val noSpecialRequirement = view.findViewById<TextView>(R.id.requirement_no_special)

        // Update the color of each requirement based on the password
        lengthRequirement.setTextColor(if (isPasswordLengthValid(password)) getColor(R.color.green) else getColor(R.color.gray))
        uppercaseRequirement.setTextColor(if (containsUppercase(password)) getColor(R.color.green) else getColor(R.color.gray))
        lowercaseRequirement.setTextColor(if (containsLowercase(password)) getColor(R.color.green) else getColor(R.color.gray))
        digitRequirement.setTextColor(if (containsDigit(password)) getColor(R.color.green) else getColor(R.color.gray))
        noSpecialRequirement.setTextColor(if (!containsSpecialCharacters(password)) getColor(R.color.green) else getColor(R.color.red))
    }

    // Function to check password length
    private fun isPasswordLengthValid(password: String): Boolean {
        return password.length >= 8
    }

    // Function to check if password contains at least one uppercase letter
    private fun containsUppercase(password: String): Boolean {
        return password.any { it.isUpperCase() }
    }

    // Function to check if password contains at least one lowercase letter
    private fun containsLowercase(password: String): Boolean {
        return password.any { it.isLowerCase() }
    }

    // Function to check if password contains at least one digit
    private fun containsDigit(password: String): Boolean {
        return password.any { it.isDigit() }
    }

    // Function to check if password contains special characters
    private fun containsSpecialCharacters(password: String): Boolean {
        val specialCharactersRegex = Regex("[^A-Za-z0-9]")
        return specialCharactersRegex.containsMatchIn(password)
    }
}