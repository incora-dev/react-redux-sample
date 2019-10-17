import React, { Component } from "react";
import { connect } from "react-redux";
import "./index.css";
import { resizeImages, dataURLtoFile } from "utils/helpers";
import { imageUpload } from "actions/images";
import { I18n } from 'react-redux-i18n';

const mapStateToProps = state => ({
  images: state.images
});

const mapDispatchToProps = dispatch => ({
  imageUpload: (image, query) => dispatch(imageUpload.request(image, query))
});

export class ImageUploader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      image: null
    };
  }

  onChangeImage(image) {
    const { name, type } = image;
    resizeImages(image, type, img => {
      const resizedImage = dataURLtoFile(img, name);
      const formData = new FormData();
      formData.append(
        "image_reference",
        resizedImage
      );
      this.setState({image: formData});
    }, 0.7, 1920, 'image-preview');
  }

  handleSubmit(event) {
    event.preventDefault();
    const { image } = this.state;
    if (!image) return;

    const { router: { location }, imageUpload } = this.props;
    const token = (location.query || {}).token;
    const coord = (location.query || {}).coord;
    const query = { token, coord };
    imageUpload(image, query);
  }

  renderErrors(error) {
    return Object.keys(error).map((key, i) => {
      return (<div className="form-user-edit__error" key={i}>{`${key}: ${error[key]}`}</div>)
    });
  }

  render() {
    const { images: { loading, response, error } } = this.props;
    const { renderErrors } = this;

    return (
      <div className="image-uploader__container">
        <div className="image-uploader__form">
          {loading ?
            (<div className="image-uploader__loading">
              {I18n.t('common.loading')}...
              </div>) : 
          response ? 
            (<div className="image-uploader__success">
              <p>{I18n.t('common.image_saved')}</p>
              {I18n.t('common.proceed_by_clicking_finished')}
            </div>) : 
            (
              <form onSubmit={this.handleSubmit.bind(this)}>
                <h2 className="image-uploader__form__title">{I18n.t('common.camera_capture')}</h2>
                {!response && <div id='image-preview' className='image-preview'></div>}
                <div className="image-uploader__form__input">
                  <input type="file" name="myImage" accept="image/*" onChange={({ target: { files } }) => this.onChangeImage(files[0])} />
                </div>
                {!!error && (
                  <div className="error-block ta-left mt-5">
                    {renderErrors(error)}
                  </div>
                )}
                <div className="image-uploader__form__btns">
                  <button type="submit">{I18n.t('common.upload')}</button>
                </div>
              </form>
            )
          }
        </div>
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ImageUploader);
