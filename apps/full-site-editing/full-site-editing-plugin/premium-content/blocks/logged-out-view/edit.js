/**
 * WordPress dependencies
 */
import { InnerBlocks } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import { useEffect } from '@wordpress/element';
import { compose } from '@wordpress/compose';
import { withDispatch, withSelect } from '@wordpress/data';
import { pick } from 'lodash';

/**
 * Internal dependencies
 */
import Context from '../container/context';
import SubmitButtons from './submit-buttons';

/**
 * Block edit function
 *
 * @typedef { import('./').Attributes } Attributes
 * @typedef { Object } Props
 * @property { boolean } isSelected
 * @property { string } className
 * @property { string } clientId
 * @property { string } containerClientId
 * @property { Attributes } attributes
 * @property { (attributes: Partial<Attributes>) => void } setAttributes
 * @property { () => void } selectBlock
 *
 * @param { Props } props
 */
function Edit( props ) {
	useEffect( () => {
		props.selectBlock();
	}, [] );

	const buttons = (
		<SubmitButtons
			{ ...{
				attributes: pick( props.attributes, [
					'subscribeButtonText',
					'loginButtonText',
					'backgroundButtonColor',
					'textButtonColor',
					'customBackgroundButtonColor',
					'customTextButtonColor',
				] ),
				setAttributes: props.setAttributes,
			} }
		/>
	);

	return (
		<Context.Consumer>
			{ ( { selectedTab, stripeNudge } ) => (
				/** @see https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/docs/rules/no-static-element-interactions.md#case-the-event-handler-is-only-being-used-to-capture-bubbled-events */
				// eslint-disable-next-line
				<div hidden={ selectedTab.id === 'premium' } className={ selectedTab.className }>
					{ stripeNudge }
					<InnerBlocks
						templateLock={ false }
						template={ [
							[
								'core/heading',
								{ content: __( 'Subscribe to get access', 'premium-content' ), level: 3 },
							],
							[
								'core/paragraph',
								{
									content: __(
										'Read more of this content when you subscribe today.',
										'premium-content'
									),
								},
							],
						] }
					/>
					{ buttons }
				</div>
			) }
		</Context.Consumer>
	);
}

export default compose( [
	withSelect( ( select, props ) => {
		return {
			// @ts-ignore difficult to type with JSDoc
			containerClientId: select( 'core/block-editor' ).getBlockHierarchyRootClientId(
				props.clientId
			),
		};
	} ),
	withDispatch( ( dispatch, props ) => {
		const blockEditor = dispatch( 'core/block-editor' );
		return {
			selectBlock() {
				// @ts-ignore difficult to type with JSDoc
				blockEditor.selectBlock( props.containerClientId );
			},
		};
	} ),
] )( Edit );
