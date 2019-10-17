import React, { Component } from "react";
import { connect } from "react-redux";
import { submit } from "redux-form";
import Modal from "components/UI/Modal";
import { deleteModule, editModule } from "actions/module";
import "./index.css";
import ModuleForm from 'components/Modules/Add/ModuleForm';
import { redirect } from 'actions/common';
import { I18n } from 'react-redux-i18n';

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => ({
  deleteModule: (courseId, moduleId) =>
    dispatch(deleteModule.request(courseId, moduleId)),
  editModule: (courseId, moduleId, data) =>
    dispatch(editModule.request(courseId, moduleId, data)),
  saveModule: () => dispatch(submit('moduleForm')),
  goToModule: (courseId, moduleId) => dispatch(redirect(`/library/courses/${courseId}/modules/${moduleId}`))
});

class ModuleCard extends Component {

  onSortChange(courseId, moduleId, currentIndex, previousIndex) {
    const { editModule } = this.props;

    if (currentIndex === previousIndex) return;
    return editModule(courseId, moduleId, {sort_index: currentIndex});
  }

  render() {
    const {
      deleteModule,
      m,
      i,
      hideGoToModule,
      saveModule,
      goToModule,
      onDragStart
    } = this.props;
    const {
      title,
      description,
      closed,
      sort_index,
      id,
      pages_count,
      course
    } = m;

    return (
      <div className="module mt-3 mb-3 col-md-6 col-sm-12 col-lg-4">
        <div className="controls-block">
          <Modal
            title={I18n.t('modules.delete_module')}
            type="delete"
            text={I18n.t('common.module')}
            contentText={I18n.t('modules.confirm_delete_module')}
            handleSubmit={() => deleteModule(course, id)}
            textCenter
          />
          <Modal type="visibility" title={`Module #${i}`} form={<ModuleForm m={m} />} />
          <Modal type="edit" title={`Module #${i}`} form={<ModuleForm m={m} />} handleSubmit={() => saveModule()} />
          <button className="btn replace" draggable="true" 
          onDragStart={onDragStart}
          onDragEnd={() => this.onSortChange.bind(this)(course, id, i, sort_index)}
           />
        </div>
        <div className="first-col">
          <div className="module-number-block">
            <div className="module-number">{i}</div>
            <div className="module-text">{I18n.t('common.module')}</div>
          </div>
          <div className="pages-details">{I18n.t('common.number_pages', { number: pages_count })}</div>
        </div>
        <div className="second-col">
          <div className="module-title">
            {title}
          </div>
          <div className="module-info">
            <div className="module-description">
              {description
                ? description.length > 160 ?
                  description.substr(0, 160) + "..."
                  :
                  description
              : ""}
            </div>
            <div className="pages-details">
              {I18n.t('common.last_page_visited')}
              {" "}
              <a href="/" className="page-link">
              {I18n.t('common.page').toLowerCase()} 4
              </a>
            </div>
          </div>
          <div hidden={closed} className="module-footer">
            <button
              className="btn module-btn"
              hidden={hideGoToModule}
              onClick={() =>
                goToModule(course, id)
              }
            >
              {I18n.t('modules.go_to_module')}
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ModuleCard);
