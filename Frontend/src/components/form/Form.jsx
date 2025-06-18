import styles from "./form.module.css";

const Form = ({ inputs, onSubmit }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      {inputs.map((input, index) => (
        <div className={styles.inputContainer} key={index}>
          <label className={styles.label}>{input.label}</label>
          <input
            className={styles.input}
            type={input.type}
            name={input.name}
            value={input.value}
            onChange={input.onChange}
          />
        </div>
      ))}
      <button className={styles.submitButton} type="submit">Submit</button>
    </form>
  );
};

export default Form;

